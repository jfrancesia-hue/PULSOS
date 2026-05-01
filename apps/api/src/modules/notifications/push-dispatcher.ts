import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Expo, type ExpoPushMessage } from 'expo-server-sdk';

export interface PushPayload {
  to: string; // ExponentPushToken[xxxxxxxx]
  title: string;
  body: string;
  data?: Record<string, string>;
}

/**
 * Dispatcher Expo Push para mobile.
 *
 * Sin EXPO_ACCESS_TOKEN, igual funciona (Expo Push no requiere token para dev).
 * En prod conviene tenerlo para tracking + receipt verification.
 */
@Injectable()
export class PushDispatcher implements OnModuleInit {
  private readonly logger = new Logger('Push');
  private expo: Expo;

  onModuleInit() {
    const accessToken = process.env.EXPO_ACCESS_TOKEN;
    this.expo = new Expo({ accessToken, useFcmV1: true });
    this.logger.log(`Expo Push listo${accessToken ? ' (con access token)' : ' (sin access token, modo dev)'}`);
  }

  async send(payload: PushPayload): Promise<{ ok: boolean; ticketId?: string; error?: string }> {
    if (!Expo.isExpoPushToken(payload.to)) {
      this.logger.warn(`Token Expo Push inválido: ${payload.to}`);
      return { ok: false, error: 'Invalid Expo push token' };
    }

    const message: ExpoPushMessage = {
      to: payload.to,
      sound: 'default',
      title: payload.title,
      body: payload.body,
      data: payload.data ?? {},
      priority: 'high',
    };

    try {
      const tickets = await this.expo.sendPushNotificationsAsync([message]);
      const ticket = tickets[0];
      if (!ticket) return { ok: false, error: 'No ticket returned' };
      if (ticket.status === 'error') {
        return { ok: false, error: ticket.message };
      }
      return { ok: true, ticketId: ticket.id };
    } catch (e) {
      this.logger.error(`Expo Push falló: ${(e as Error).message}`);
      return { ok: false, error: (e as Error).message };
    }
  }
}
