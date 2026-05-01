import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';

import { PrismaModule } from './common/prisma/prisma.module';
import { AuditModule } from './common/audit/audit.module';
import { AuthCommonModule } from './common/auth';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { PulsoIdModule } from './modules/pulso-id/pulso-id.module';
import { EmergencyModule } from './modules/emergency/emergency.module';
import { ClinicalModule } from './modules/clinical/clinical.module';
import { MicaModule } from './modules/mica/mica.module';
import { AdminModule } from './modules/admin/admin.module';
import { ConnectModule } from './modules/connect/connect.module';
import { HealthController } from './modules/health/health.controller';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRoot([
      { name: 'default', ttl: 60_000, limit: 60 },
      { name: 'auth', ttl: 60_000, limit: 5 },
      { name: 'emergency', ttl: 60_000, limit: 10 },
    ]),
    PrismaModule,
    AuditModule,
    AuthCommonModule,
    AuthModule,
    UsersModule,
    PulsoIdModule,
    EmergencyModule,
    ClinicalModule,
    MicaModule,
    AdminModule,
    ConnectModule,
  ],
  controllers: [HealthController],
  providers: [{ provide: APP_GUARD, useClass: ThrottlerGuard }],
})
export class AppModule {}
