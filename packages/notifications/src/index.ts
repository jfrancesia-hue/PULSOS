export interface EmailMessage {
  to: string;
  subject: string;
  body: string;
  html?: string;
}

export interface PushMessage {
  to: string;
  title: string;
  body: string;
  data?: Record<string, string>;
}

export interface WhatsAppMessage {
  to: string;
  body: string;
  templateId?: string;
  variables?: Record<string, string>;
}

export interface NotificationDispatcher {
  email(msg: EmailMessage): Promise<void>;
  push(msg: PushMessage): Promise<void>;
  whatsapp(msg: WhatsAppMessage): Promise<void>;
}

/**
 * Stub dispatcher — registra a stdout. Reemplazar en producción por:
 *   · email: Resend o SES
 *   · push: Expo Push Notifications
 *   · whatsapp: Twilio WhatsApp Business API
 */
export const consoleDispatcher: NotificationDispatcher = {
  async email(msg) {
    console.log('[notif:email]', msg.to, msg.subject);
  },
  async push(msg) {
    console.log('[notif:push]', msg.to, msg.title);
  },
  async whatsapp(msg) {
    console.log('[notif:whatsapp]', msg.to, msg.body.slice(0, 80));
  },
};
