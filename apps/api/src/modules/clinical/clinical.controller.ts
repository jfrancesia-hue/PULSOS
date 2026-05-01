import { Body, Controller, Get, Param, Post, Query, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { IsArray, IsEnum, IsInt, IsOptional, IsString, MaxLength, Min, MinLength, Max } from 'class-validator';
import type { Request } from 'express';
import { ClinicalService } from './clinical.service';
import { CurrentUser, Roles, type AuthContext } from '../../common/auth';

class CreateEvolucionDto {
  @IsString() ciudadanoId!: string;
  @IsEnum(['CONSULTA', 'EVOLUCION', 'ESTUDIO', 'INTERNACION', 'CIRUGIA', 'VACUNACION', 'RECETA', 'DERIVACION', 'OTRO'])
  tipo!: string;
  @IsString() @MinLength(2) @MaxLength(240) titulo!: string;
  @IsOptional() @IsString() @MaxLength(8000) descripcion?: string;
}

class RequestConsentDto {
  @IsString() ciudadanoDni!: string;
  @IsArray() @IsEnum(['PERFIL_BASICO', 'PERFIL_COMPLETO', 'TIMELINE_CLINICO', 'CARGA_EVOLUCION', 'EMERGENCIA'], { each: true })
  scopes!: string[];
  @IsString() @MinLength(2) @MaxLength(500) motivo!: string;
}

class RespondConsentDto {
  @IsEnum(['APPROVE', 'REJECT']) decision!: 'APPROVE' | 'REJECT';
  @IsOptional() @IsString() @MaxLength(500) rejectionReason?: string;
  @IsOptional() @IsInt() @Min(1) @Max(365) durationDays?: number;
}

@ApiBearerAuth()
@ApiTags('clinical')
@Controller('clinical')
export class ClinicalController {
  constructor(private readonly service: ClinicalService) {}

  @Roles('PROFESIONAL')
  @Get('search')
  search(@CurrentUser() user: AuthContext, @Query('dni') dni: string, @Req() req: Request) {
    return this.service.searchByDni(user.userId, dni, this.ctx(req));
  }

  @Roles('PROFESIONAL')
  @Get('citizen/:citizenId/timeline')
  timeline(
    @CurrentUser() user: AuthContext,
    @Param('citizenId') citizenId: string,
    @Req() req: Request,
  ) {
    return this.service.timelineByCitizenId(user.userId, citizenId, this.ctx(req));
  }

  @Roles('PROFESIONAL')
  @Post('evolucion')
  createEvolucion(
    @CurrentUser() user: AuthContext,
    @Body() dto: CreateEvolucionDto,
    @Req() req: Request,
  ) {
    return this.service.createEvolucion(user.userId, dto, this.ctx(req));
  }

  @Roles('PROFESIONAL')
  @Post('consent/request')
  requestConsent(@CurrentUser() user: AuthContext, @Body() dto: RequestConsentDto) {
    return this.service.requestConsent(user.userId, dto);
  }

  /**
   * Ciudadano responde a una solicitud de consent (aprueba o rechaza).
   */
  @Post('consent/:id/respond')
  respondConsent(
    @CurrentUser() user: AuthContext,
    @Param('id') id: string,
    @Body() dto: RespondConsentDto,
  ) {
    return this.service.respondConsent(user.userId, id, dto.decision, {
      rejectionReason: dto.rejectionReason,
      durationDays: dto.durationDays,
    });
  }

  /**
   * Ciudadano revoca un consent vigente.
   */
  @Post('consent/:id/revoke')
  revokeConsent(@CurrentUser() user: AuthContext, @Param('id') id: string) {
    return this.service.revokeConsent(user.userId, id);
  }

  private ctx(req: Request) {
    return { ip: req.ip ?? null, userAgent: req.headers['user-agent'] ?? null };
  }
}
