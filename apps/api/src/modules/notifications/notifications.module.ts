import { Global, Module } from '@nestjs/common';
import { NotificationsController } from './notifications.controller';
import { NotificationsService } from './notifications.service';
import { SmtpDispatcher } from './smtp-dispatcher';

@Global()
@Module({
  controllers: [NotificationsController],
  providers: [NotificationsService, SmtpDispatcher],
  exports: [NotificationsService],
})
export class NotificationsModule {}
