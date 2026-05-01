import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PrismaService } from '../../common/prisma/prisma.service';
import { AuditService } from '../../common/audit/audit.service';

@ApiTags('admin')
@Controller('admin')
export class AdminController {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
  ) {}

  /**
   * NOTA: en producción todos los endpoints admin requieren rol ADMIN o SUPERADMIN
   * con MFA satisfecho. Ver docs/CODEX_HANDOFF.md P0.2.
   */
  @Get('metrics')
  async metrics() {
    const [users, citizens, professionals, institutions, qrs, audits] = await Promise.all([
      this.prisma.client.user.count(),
      this.prisma.client.citizenProfile.count(),
      this.prisma.client.professionalProfile.count(),
      this.prisma.client.institution.count(),
      this.prisma.client.emergencyAccess.count(),
      this.prisma.client.auditLog.count(),
    ]);
    return { users, citizens, professionals, institutions, qrs, audits };
  }

  @Get('audit')
  async auditLog(@Query('limit') limit = '50') {
    return this.prisma.client.auditLog.findMany({
      take: Math.min(Number(limit), 200),
      orderBy: { occurredAt: 'desc' },
    });
  }

  @Get('audit/verify')
  async verify() {
    return this.audit.verifyRange({ limit: 1000 });
  }
}
