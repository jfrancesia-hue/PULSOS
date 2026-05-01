import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  NotFoundException,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { IsEnum, IsOptional } from 'class-validator';
import type { Request } from 'express';
import { EmergencyService } from './emergency.service';
import { CurrentUser, Public, type AuthContext } from '../../common/auth';

class CreateQrDto {
  @IsOptional()
  @IsEnum(['H_24', 'D_7', 'D_30', 'NUNCA'])
  ttl?: 'H_24' | 'D_7' | 'D_30' | 'NUNCA';
}

@ApiTags('emergency')
@Controller('emergency')
export class EmergencyController {
  constructor(private readonly service: EmergencyService) {}

  @Public()
  @Throttle({ emergency: { ttl: 60_000, limit: 10 } })
  @Get('public/:token')
  async getByToken(@Param('token') token: string, @Req() req: Request) {
    const data = await this.service.accessByToken(token, {
      ip: req.ip ?? null,
      userAgent: req.headers['user-agent'] ?? null,
    });
    if (!data) throw new NotFoundException('QR no encontrado o expirado.');
    return data;
  }

  @ApiBearerAuth()
  @Get('me')
  myQrs(@CurrentUser() user: AuthContext) {
    return this.service.listByUser(user.userId);
  }

  @ApiBearerAuth()
  @Post('me')
  createQr(@CurrentUser() user: AuthContext, @Body() dto: CreateQrDto) {
    return this.service.create(user.userId, dto.ttl ?? 'D_30');
  }

  @ApiBearerAuth()
  @Delete('me/:qrId')
  revokeQr(@CurrentUser() user: AuthContext, @Param('qrId') qrId: string) {
    return this.service.revoke(user.userId, qrId);
  }

  @ApiBearerAuth()
  @Get('me/:qrId/logs')
  qrLogs(@CurrentUser() user: AuthContext, @Param('qrId') qrId: string) {
    return this.service.logsForUser(user.userId, qrId);
  }
}
