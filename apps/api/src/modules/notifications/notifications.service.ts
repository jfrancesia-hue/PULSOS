import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { SmtpDispatcher } from './smtp-dispatcher';

type Channel = 'EMAIL' | 'PUSH' | 'WHATSAPP' | 'IN_APP';
type Category =
  | 'EMERGENCY_QR_ACCESSED'
  | 'CONSENT_REQUEST'
  | 'CONSENT_GRANTED'
  | 'CLINICAL_RECORD_ADDED'
  | 'PRESCRIPTION_ISSUED'
  | 'MEDICATION_REMINDER'
  | 'EMAIL_VERIFICATION'
  | 'PASSWORD_RESET'
  | 'WELCOME'
  | 'OTHER';

export interface DispatchInput {
  userId: string;
  channel: Channel;
  category: Category;
  title: string;
  body: string;
  payload?: Record<string, unknown>;
}

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger('Notifications');
  constructor(
    private readonly prisma: PrismaService,
    private readonly smtp: SmtpDispatcher,
  ) {}

  /**
   * Helper: dispara la misma notificación por múltiples canales en paralelo.
   * Cada canal se persiste y se envía por separado, errores no bloquean a los otros.
   */
  async dispatchMulti(
    base: Omit<DispatchInput, 'channel'>,
    channels: Channel[],
  ): Promise<void> {
    await Promise.all(channels.map((channel) => this.dispatch({ ...base, channel })));
  }

  async dispatch(input: DispatchInput): Promise<void> {
    const notification = await this.prisma.client.notification.create({
      data: {
        userId: input.userId,
        channel: input.channel as never,
        category: input.category as never,
        status: 'PENDING',
        title: input.title,
        body: input.body,
        payload: (input.payload ?? null) as never,
      },
    });

    try {
      if (input.channel === 'EMAIL') {
        const user = await this.prisma.client.user.findUnique({
          where: { id: input.userId },
          select: { email: true },
        });
        if (!user) throw new Error('Usuario no encontrado para envío de email.');

        const result = await this.smtp.send({
          to: user.email,
          subject: input.title,
          text: this.renderEmailText(input),
          html: this.renderEmailHtml(input),
        });
        if (!result.ok) throw new Error(result.error ?? 'fallo SMTP');
      }
      // IN_APP, PUSH, WHATSAPP: por ahora solo persistencia. Codex puede activar
      // adapters reales en P1 (Expo Push, Twilio).

      await this.prisma.client.notification.update({
        where: { id: notification.id },
        data: { status: 'SENT', sentAt: new Date() },
      });
    } catch (err) {
      const error = err instanceof Error ? err.message : 'unknown';
      this.logger.error(`Falló dispatch (${input.category}/${input.channel}): ${error}`);
      await this.prisma.client.notification.update({
        where: { id: notification.id },
        data: { status: 'FAILED', errorMsg: error },
      });
    }
  }

  async listForUser(userId: string, opts: { unreadOnly?: boolean; take?: number } = {}) {
    return this.prisma.client.notification.findMany({
      where: {
        userId,
        ...(opts.unreadOnly ? { readAt: null } : {}),
      },
      orderBy: { createdAt: 'desc' },
      take: opts.take ?? 50,
    });
  }

  async markRead(userId: string, id: string) {
    return this.prisma.client.notification.updateMany({
      where: { id, userId },
      data: { readAt: new Date(), status: 'READ' },
    });
  }

  async markAllRead(userId: string) {
    return this.prisma.client.notification.updateMany({
      where: { userId, readAt: null },
      data: { readAt: new Date(), status: 'READ' },
    });
  }

  private renderEmailText(input: DispatchInput): string {
    const lines = [`# ${input.title}`, '', input.body];
    const url = (input.payload as Record<string, string> | null)?.verifyUrl
      ?? (input.payload as Record<string, string> | null)?.resetUrl
      ?? (input.payload as Record<string, string> | null)?.actionUrl;
    if (url) {
      lines.push('', url);
    }
    lines.push('', '---', 'Pulso · Plataforma de salud digital argentina', 'Por Nativos Consultora Digital');
    return lines.join('\n');
  }

  private renderEmailHtml(input: DispatchInput): string {
    const url = (input.payload as Record<string, string> | null)?.verifyUrl
      ?? (input.payload as Record<string, string> | null)?.resetUrl
      ?? (input.payload as Record<string, string> | null)?.actionUrl;
    return `
<!DOCTYPE html>
<html lang="es-AR">
<head>
  <meta charset="utf-8">
  <title>${escapeHtml(input.title)}</title>
</head>
<body style="margin:0;padding:0;background:#0A1628;font-family:system-ui,-apple-system,sans-serif;color:#F5F1EA;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0A1628;padding:40px 16px;">
    <tr>
      <td align="center">
        <table width="560" cellpadding="0" cellspacing="0" style="background:#0F1F3D;border:1px solid rgba(43,212,201,0.20);border-radius:16px;overflow:hidden;">
          <tr>
            <td style="padding:32px 32px 8px 32px;">
              <div style="font-family:system-ui;font-weight:800;letter-spacing:0.04em;color:#2BD4C9;font-size:18px;">PULSO</div>
            </td>
          </tr>
          <tr>
            <td style="padding:0 32px;">
              <h1 style="margin:16px 0 12px 0;font-size:24px;color:#F5F1EA;">${escapeHtml(input.title)}</h1>
              <p style="margin:0 0 20px 0;font-size:14px;line-height:1.6;color:#C7CDD9;">${escapeHtml(input.body).replace(/\n/g, '<br>')}</p>
              ${url ? `<a href="${escapeHtml(url)}" style="display:inline-block;background:#2BD4C9;color:#050B14;text-decoration:none;font-weight:600;padding:12px 24px;border-radius:8px;font-size:14px;margin-bottom:20px;">Continuar</a>` : ''}
              <hr style="border:none;border-top:1px solid rgba(255,255,255,0.05);margin:28px 0 16px 0;">
              <p style="margin:0;font-size:11px;color:#6B7A93;line-height:1.6;">Pulso · Plataforma de salud digital argentina<br>Por Nativos Consultora Digital</p>
            </td>
          </tr>
          <tr><td style="padding:32px;"></td></tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`.trim();
  }
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
