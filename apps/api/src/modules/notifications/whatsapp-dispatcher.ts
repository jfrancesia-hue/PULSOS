import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import twilio from 'twilio';

export interface WhatsAppPayload {
  to: string; // E.164 format: +5491155667788
  body: string;
}

/**
 * Dispatcher Twilio WhatsApp Business.
 *
 * Sin TWILIO_* env, hace logging stdout (no falla).
 * Con TWILIO_*, envía vía API real.
 *
 * Nota: el número 'to' debe estar verificado en Twilio Sandbox para dev.
 * En prod requiere templates aprobados por Meta.
 */
@Injectable()
export class WhatsAppDispatcher implements OnModuleInit {
  private readonly logger = new Logger('WhatsApp');
  private client: ReturnType<typeof twilio> | null = null;
  private fromNumber: string | null = null;

  onModuleInit() {
    const sid = process.env.TWILIO_ACCOUNT_SID;
    const token = process.env.TWILIO_AUTH_TOKEN;
    this.fromNumber = process.env.TWILIO_WHATSAPP_FROM ?? null;

    if (!sid || !token || !this.fromNumber) {
      this.logger.warn('TWILIO_* no configurado. WhatsApp se imprime a stdout solamente.');
      return;
    }
    this.client = twilio(sid, token);
    this.logger.log(`WhatsApp listo (from ${this.fromNumber})`);
  }

  async send(payload: WhatsAppPayload): Promise<{ ok: boolean; sid?: string; error?: string }> {
    if (!this.client || !this.fromNumber) {
      this.logger.log(`[whatsapp-stdout] to=${payload.to} body="${payload.body.slice(0, 100)}"`);
      return { ok: true, sid: 'stdout' };
    }
    try {
      const msg = await this.client.messages.create({
        from: `whatsapp:${this.fromNumber}`,
        to: `whatsapp:${normalizePhone(payload.to)}`,
        body: payload.body,
      });
      return { ok: true, sid: msg.sid };
    } catch (e) {
      this.logger.error(`Twilio falló: ${(e as Error).message}`);
      return { ok: false, error: (e as Error).message };
    }
  }
}

function normalizePhone(phone: string): string {
  // Acepta: +54 9 11 5566 7788 / 54 9 11 5566 7788 / +5491155667788
  const clean = phone.replace(/[\s-]/g, '');
  if (clean.startsWith('+')) return clean;
  if (clean.startsWith('54')) return `+${clean}`;
  return `+54${clean}`;
}
