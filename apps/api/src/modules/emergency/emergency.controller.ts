import { Controller, Get, Param, Req, NotFoundException } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import type { Request } from 'express';
import { EmergencyService } from './emergency.service';

@ApiTags('emergency')
@Controller('emergency')
export class EmergencyController {
  constructor(private readonly service: EmergencyService) {}

  /**
   * Endpoint público — no requiere auth.
   * Rate limit estricto (10 req/min/IP) y log obligatorio en cada acceso.
   */
  @Get(':token')
  @Throttle({ emergency: { ttl: 60_000, limit: 10 } })
  async getByToken(@Param('token') token: string, @Req() req: Request) {
    const data = await this.service.accessByToken(token, {
      ip: req.ip ?? null,
      userAgent: req.headers['user-agent'] ?? null,
    });
    if (!data) throw new NotFoundException('QR no encontrado o expirado.');
    return data;
  }
}
