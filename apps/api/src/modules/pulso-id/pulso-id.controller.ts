import { Body, Controller, Get, NotFoundException, Patch, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import type { Request } from 'express';
import { PulsoIdService } from './pulso-id.service';
import { UpdateProfileDto, UpdateAlergiasDto, UpdateMedicacionDto, UpdateCondicionesDto, UpdateContactoDto, UpdateCoberturaDto } from './pulso-id.dto';
import { CurrentUser, type AuthContext } from '../../common/auth';

@ApiBearerAuth()
@ApiTags('pulso-id')
@Controller('pulso-id')
export class PulsoIdController {
  constructor(private readonly service: PulsoIdService) {}

  @Get('me')
  async me(@CurrentUser() user: AuthContext, @Req() req: Request) {
    const profile = await this.service.getMyProfile(user.userId, {
      ip: req.ip ?? null,
      userAgent: req.headers['user-agent'] ?? null,
    });
    if (!profile) throw new NotFoundException('No tenés perfil ciudadano. Completá tu Pulso ID.');
    return profile;
  }

  @Patch('me')
  updateProfile(@CurrentUser() user: AuthContext, @Body() dto: UpdateProfileDto) {
    return this.service.updateProfile(user.userId, dto);
  }

  @Patch('me/alergias')
  updateAlergias(@CurrentUser() user: AuthContext, @Body() dto: UpdateAlergiasDto) {
    return this.service.updateAlergias(user.userId, dto.alergias);
  }

  @Patch('me/medicacion')
  updateMedicacion(@CurrentUser() user: AuthContext, @Body() dto: UpdateMedicacionDto) {
    return this.service.updateMedicacion(user.userId, dto.medicacion);
  }

  @Patch('me/condiciones')
  updateCondiciones(@CurrentUser() user: AuthContext, @Body() dto: UpdateCondicionesDto) {
    return this.service.updateCondiciones(user.userId, dto.condiciones);
  }

  @Patch('me/contacto-emergencia')
  updateContacto(@CurrentUser() user: AuthContext, @Body() dto: UpdateContactoDto) {
    return this.service.updateContacto(user.userId, dto);
  }

  @Patch('me/cobertura')
  updateCobertura(@CurrentUser() user: AuthContext, @Body() dto: UpdateCoberturaDto) {
    return this.service.updateCobertura(user.userId, dto);
  }

  @Get('me/documentos')
  myDocuments(@CurrentUser() user: AuthContext) {
    return this.service.listDocuments(user.userId);
  }

  @Get('me/consentimientos')
  myConsents(@CurrentUser() user: AuthContext) {
    return this.service.listConsents(user.userId);
  }
}
