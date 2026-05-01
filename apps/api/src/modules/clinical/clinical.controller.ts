import { Body, Controller, Get, Param, Post, Query, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { IsArray, IsEnum, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
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

  private ctx(req: Request) {
    return { ip: req.ip ?? null, userAgent: req.headers['user-agent'] ?? null };
  }
}
