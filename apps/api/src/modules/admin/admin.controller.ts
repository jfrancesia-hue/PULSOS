import { Body, Controller, Get, Param, Patch, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { PrismaService } from '../../common/prisma/prisma.service';
import { AuditService } from '../../common/audit/audit.service';
import { CurrentUser, Roles, type AuthContext } from '../../common/auth';

class ChangeRoleDto {
  @IsEnum(['CIUDADANO', 'PROFESIONAL', 'FARMACIA', 'INSTITUCION', 'ADMIN', 'SUPERADMIN'])
  role!: string;
}
class ChangeStatusDto {
  @IsEnum(['ACTIVE', 'PENDING_VERIFICATION', 'SUSPENDED', 'DELETED'])
  status!: string;
}

@ApiBearerAuth()
@ApiTags('admin')
@Roles('ADMIN')
@Controller('admin')
export class AdminController {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
  ) {}

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

  @Get('users')
  users(@Query('q') q?: string, @Query('role') role?: string) {
    return this.prisma.client.user.findMany({
      where: {
        AND: [
          q ? { email: { contains: q, mode: 'insensitive' as const } } : {},
          role ? { role: role as never } : {},
        ],
      },
      orderBy: { createdAt: 'desc' },
      take: 100,
      select: {
        id: true,
        email: true,
        role: true,
        status: true,
        mfaEnabled: true,
        lastLoginAt: true,
        createdAt: true,
        citizenProfile: { select: { dni: true, nombre: true, apellido: true, provincia: true } },
        professionalProfile: { select: { matriculaNacional: true, especialidades: true } },
      },
    });
  }

  @Patch('users/:id/role')
  async changeRole(
    @CurrentUser() actor: AuthContext,
    @Param('id') id: string,
    @Body() dto: ChangeRoleDto,
  ) {
    const user = await this.prisma.client.user.update({
      where: { id },
      data: { role: dto.role as never },
    });
    await this.audit.append({
      actorId: actor.userId,
      actorRole: actor.role,
      action: 'ADMIN_USER_ROLE_CHANGED',
      targetType: 'User',
      targetId: id,
      outcome: 'SUCCESS',
      payload: { newRole: dto.role },
    });
    return user;
  }

  @Patch('users/:id/status')
  async changeStatus(
    @CurrentUser() actor: AuthContext,
    @Param('id') id: string,
    @Body() dto: ChangeStatusDto,
  ) {
    const user = await this.prisma.client.user.update({
      where: { id },
      data: { status: dto.status as never },
    });
    if (dto.status === 'SUSPENDED') {
      await this.audit.append({
        actorId: actor.userId,
        actorRole: actor.role,
        action: 'ADMIN_USER_SUSPENDED',
        targetType: 'User',
        targetId: id,
        outcome: 'SUCCESS',
        payload: {},
      });
    }
    return user;
  }

  @Get('institutions')
  institutions(@Query('q') q?: string) {
    return this.prisma.client.institution.findMany({
      where: q
        ? { OR: [{ razonSocial: { contains: q, mode: 'insensitive' } }, { cuit: { contains: q } }] }
        : {},
      orderBy: { createdAt: 'desc' },
      take: 100,
    });
  }

  @Get('professionals')
  professionals() {
    return this.prisma.client.professionalProfile.findMany({
      orderBy: { createdAt: 'desc' },
      take: 100,
      include: { user: { select: { email: true, status: true, lastLoginAt: true } } },
    });
  }

  @Get('emergency-accesses')
  emergencyAccesses() {
    return this.prisma.client.emergencyAccess.findMany({
      orderBy: { createdAt: 'desc' },
      take: 100,
      include: {
        user: { select: { email: true, citizenProfile: { select: { nombre: true, apellido: true, dni: true } } } },
        _count: { select: { logs: true } },
      },
    });
  }

  @Get('audit')
  async auditLog(@Query('limit') limit = '50', @Query('action') action?: string) {
    return this.prisma.client.auditLog.findMany({
      where: action ? { action: action as never } : {},
      take: Math.min(Number(limit), 200),
      orderBy: { occurredAt: 'desc' },
    });
  }

  @Get('audit/verify')
  async verify(@CurrentUser() actor: AuthContext) {
    const result = await this.audit.verifyRange({ limit: 1000 });
    await this.audit.append({
      actorId: actor.userId,
      actorRole: actor.role,
      action: 'ADMIN_AUDIT_VERIFIED',
      targetType: 'AuditLog',
      targetId: null,
      outcome: result.ok ? 'SUCCESS' : 'FAILURE',
      payload: { ok: result.ok, totalChecked: result.totalChecked, brokenAt: result.brokenAt ?? null },
    });
    return result;
  }
}
