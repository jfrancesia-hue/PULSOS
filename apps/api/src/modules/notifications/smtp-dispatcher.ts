import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import nodemailer, { type Transporter } from 'nodemailer';

export interface EmailPayload {
  to: string;
  subject: string;
  text: string;
  html?: string;
}

/**
 * Dispatcher SMTP. Usa MailHog en dev (port 1025) y un SMTP real en prod
 * (configurable por env: SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS).
 *
 * Si no hay SMTP_HOST configurado, hace logging-only (no falla).
 */
@Injectable()
export class SmtpDispatcher implements OnModuleInit {
  private readonly logger = new Logger('SmtpDispatcher');
  private transporter: Transporter | null = null;
  private readonly fromAddress = process.env.SMTP_FROM ?? 'Pulso <no-reply@pulso.local>';

  async onModuleInit() {
    const host = process.env.SMTP_HOST;
    if (!host) {
      this.logger.warn('SMTP_HOST no configurado. Mails se imprimen a stdout solamente.');
      return;
    }
    const port = Number(process.env.SMTP_PORT ?? 587);
    const secure = process.env.SMTP_SECURE === 'true';
    const auth = process.env.SMTP_USER
      ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS ?? '' }
      : undefined;
    this.transporter = nodemailer.createTransport({ host, port, secure, auth });
    try {
      await this.transporter.verify();
      this.logger.log(`SMTP conectado: ${host}:${port}`);
    } catch (e) {
      this.logger.error(`SMTP no responde: ${(e as Error).message}. Mails caerán a stdout.`);
      this.transporter = null;
    }
  }

  async send(payload: EmailPayload): Promise<{ ok: boolean; messageId?: string; error?: string }> {
    if (!this.transporter) {
      this.logger.log(
        `[mail-stdout] to=${payload.to} subject="${payload.subject}"\n--- text ---\n${payload.text}\n--- end ---`,
      );
      return { ok: true, messageId: 'stdout' };
    }
    try {
      const info = await this.transporter.sendMail({
        from: this.fromAddress,
        to: payload.to,
        subject: payload.subject,
        text: payload.text,
        html: payload.html,
      });
      return { ok: true, messageId: info.messageId };
    } catch (e) {
      this.logger.error(`Falló envío SMTP a ${payload.to}: ${(e as Error).message}`);
      return { ok: false, error: (e as Error).message };
    }
  }
}
