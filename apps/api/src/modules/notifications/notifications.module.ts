import { Global, Module } from '@nestjs/common';
import { NotificationsController } from './notifications.controller';
import { NotificationsService } from './notifications.service';
import { SmtpDispatcher } from './smtp-dispatcher';
import { WhatsAppDispatcher } from './whatsapp-dispatcher';
import { PushDispatcher } from './push-dispatcher';

@Global()
@Module({
  controllers: [NotificationsController],
  providers: [NotificationsService, SmtpDispatcher, WhatsAppDispatcher, PushDispatcher],
  exports: [NotificationsService],
})
export class NotificationsModule {}
