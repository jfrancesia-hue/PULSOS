import { Body, Controller, Get, HttpCode, Post, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import type { Request } from 'express';
import { AuthService } from './auth.service';
import {
  ChangePasswordDto,
  ForgotPasswordDto,
  LoginDto,
  MfaVerifyDto,
  RefreshDto,
  ResetPasswordDto,
  SignupDto,
  VerifyEmailDto,
} from './auth.dto';
import { CurrentUser, Public, type AuthContext } from '../../common/auth';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Public()
  @Post('signup')
  @Throttle({ auth: { ttl: 60_000, limit: 5 } })
  signup(@Body() dto: SignupDto, @Req() req: Request) {
    return this.auth.signup(dto, this.ctx(req));
  }

  @Public()
  @Post('login')
  @Throttle({ auth: { ttl: 60_000, limit: 5 } })
  login(@Body() dto: LoginDto, @Req() req: Request) {
    return this.auth.login(dto, this.ctx(req));
  }

  @Public()
  @Post('refresh')
  @Throttle({ auth: { ttl: 60_000, limit: 10 } })
  refresh(@Body() dto: RefreshDto, @Req() req: Request) {
    return this.auth.refresh(dto.refreshToken, this.ctx(req));
  }

  @Public()
  @Post('verify-email')
  @HttpCode(200)
  verifyEmail(@Body() dto: VerifyEmailDto) {
    return this.auth.verifyEmail(dto.token);
  }

  @Public()
  @Post('forgot-password')
  @Throttle({ auth: { ttl: 60_000, limit: 5 } })
  @HttpCode(200)
  forgotPassword(@Body() dto: ForgotPasswordDto, @Req() req: Request) {
    return this.auth.forgotPassword(dto.email, this.ctx(req));
  }

  @Public()
  @Post('reset-password')
  @Throttle({ auth: { ttl: 60_000, limit: 5 } })
  @HttpCode(200)
  resetPassword(@Body() dto: ResetPasswordDto, @Req() req: Request) {
    return this.auth.resetPassword(dto.token, dto.newPassword, this.ctx(req));
  }

  @ApiBearerAuth()
  @Post('logout')
  @HttpCode(200)
  logout(@CurrentUser() user: AuthContext, @Body() dto?: RefreshDto) {
    return this.auth.logout(user.userId, dto?.refreshToken);
  }

  @ApiBearerAuth()
  @Get('me')
  me(@CurrentUser() user: AuthContext) {
    return this.auth.me(user.userId);
  }

  @ApiBearerAuth()
  @Post('change-password')
  @HttpCode(200)
  changePassword(@CurrentUser() user: AuthContext, @Body() dto: ChangePasswordDto) {
    return this.auth.changePassword(user.userId, dto.currentPassword, dto.newPassword);
  }

  @ApiBearerAuth()
  @Post('mfa/enroll')
  @HttpCode(200)
  mfaEnroll(@CurrentUser() user: AuthContext) {
    return this.auth.mfaEnroll(user.userId);
  }

  @ApiBearerAuth()
  @Post('mfa/activate')
  @HttpCode(200)
  mfaActivate(@CurrentUser() user: AuthContext, @Body() dto: MfaVerifyDto) {
    return this.auth.mfaActivate(user.userId, dto.token);
  }

  @ApiBearerAuth()
  @Post('mfa/disable')
  @HttpCode(200)
  mfaDisable(@CurrentUser() user: AuthContext, @Body() dto: MfaVerifyDto) {
    return this.auth.mfaDisable(user.userId, dto.token);
  }

  private ctx(req: Request) {
    return { ip: req.ip ?? null, userAgent: req.headers['user-agent'] ?? null };
  }
}
