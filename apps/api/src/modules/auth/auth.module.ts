import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { SessionsController } from './sessions.controller';

@Module({
  controllers: [AuthController, SessionsController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
