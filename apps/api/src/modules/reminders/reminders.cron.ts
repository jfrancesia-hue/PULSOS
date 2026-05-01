import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../../common/prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';

/**
 * Job que cada 5 minutos revisa MedicationReminder activos y dispara
 * notificaciones cuando matches con la hora actual (HH:MM en zona AR).
 *
 * Reglas:
 *  - active=false → skip
 *  - endDate pasada → marca active=false y skip
 *  - lastFiredAt está dentro del mismo minuto → skip (evita duplicados)
 *  - dispara notif IN_APP + email
 */
@Injectable()
export class RemindersCron {
  private readonly logger = new Logger('RemindersCron');

  constructor(
    private readonly prisma: PrismaService,
    private readonly notifications: NotificationsService,
  ) {}

  @Cron(CronExpression.EVERY_5_MINUTES, { name: 'medication-reminders' })
  async tick() {
    const now = new Date();
    const argHour = formatHour(now);

    const reminders = await this.prisma.client.medicationReminder.findMany({
      where: { active: true, hours: { has: argHour } },
    });

    for (const reminder of reminders) {
      try {
        if (reminder.endDate && reminder.endDate < now) {
          await this.prisma.client.medicationReminder.update({
            where: { id: reminder.id },
            data: { active: false },
          });
          continue;
        }

        if (reminder.lastFiredAt && sameMinute(reminder.lastFiredAt, now)) continue;
        if (reminder.startDate > now) continue;

        await this.notifications.dispatchMulti(
          {
            userId: reminder.userId,
            category: 'MEDICATION_REMINDER',
            title: `Hora de tomar ${reminder.medicacion}`,
            body: `${reminder.medicacion}${reminder.presentacion ? ' · ' + reminder.presentacion : ''}${reminder.posologia ? ' · ' + reminder.posologia : ''}`,
            payload: { reminderId: reminder.id, actionUrl: '/panel/recordatorios' },
          },
          ['IN_APP', 'EMAIL'],
        );

        await this.prisma.client.medicationReminder.update({
          where: { id: reminder.id },
          data: { lastFiredAt: now },
        });
      } catch (err) {
        this.logger.error(
          `Falló disparo recordatorio ${reminder.id}: ${(err as Error).message}`,
        );
      }
    }

    if (reminders.length > 0) {
      this.logger.log(`Disparados ${reminders.length} recordatorios a las ${argHour}`);
    }
  }
}

function formatHour(d: Date): string {
  const argTime = new Date(d.toLocaleString('en-US', { timeZone: 'America/Argentina/Buenos_Aires' }));
  const h = String(argTime.getHours()).padStart(2, '0');
  const m = String(argTime.getMinutes()).padStart(2, '0');
  return `${h}:${m}`;
}

function sameMinute(a: Date, b: Date): boolean {
  return Math.abs(a.getTime() - b.getTime()) < 60_000;
}
