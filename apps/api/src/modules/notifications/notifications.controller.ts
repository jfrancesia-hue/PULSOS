import { Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { NotificationsService } from './notifications.service';
import { CurrentUser, type AuthContext } from '../../common/auth';

@ApiBearerAuth()
@ApiTags('notifications')
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly service: NotificationsService) {}

  @Get('me')
  list(
    @CurrentUser() user: AuthContext,
    @Query('unreadOnly') unreadOnly?: string,
    @Query('take') take?: string,
  ) {
    return this.service.listForUser(user.userId, {
      unreadOnly: unreadOnly === 'true',
      take: take ? Number(take) : 50,
    });
  }

  @Post(':id/read')
  markRead(@CurrentUser() user: AuthContext, @Param('id') id: string) {
    return this.service.markRead(user.userId, id);
  }

  @Post('me/read-all')
  markAllRead(@CurrentUser() user: AuthContext) {
    return this.service.markAllRead(user.userId);
  }
}
