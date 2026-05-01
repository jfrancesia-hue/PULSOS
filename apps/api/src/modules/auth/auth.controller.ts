import { Body, Controller, Post, Req } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import type { Request } from 'express';
import { AuthService } from './auth.service';
import { LoginDto, SignupDto } from './auth.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Post('signup')
  @Throttle({ auth: { ttl: 60_000, limit: 5 } })
  signup(@Body() dto: SignupDto, @Req() req: Request) {
    return this.auth.signup(dto, { ip: req.ip ?? null, userAgent: req.headers['user-agent'] ?? null });
  }

  @Post('login')
  @Throttle({ auth: { ttl: 60_000, limit: 5 } })
  login(@Body() dto: LoginDto, @Req() req: Request) {
    return this.auth.login(dto, { ip: req.ip ?? null, userAgent: req.headers['user-agent'] ?? null });
  }
}
