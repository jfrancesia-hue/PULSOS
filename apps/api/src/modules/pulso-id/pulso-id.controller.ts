import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PulsoIdService } from './pulso-id.service';

@ApiTags('pulso-id')
@Controller('pulso-id')
export class PulsoIdController {
  constructor(private readonly service: PulsoIdService) {}

  /**
   * NOTA: en producción este endpoint exige JWT + RBAC + consent vigente
   * (ver docs/CODEX_HANDOFF.md P0.5). Por ahora devuelve el perfil básico
   * para poder hacer pruebas de integración con seed demo.
   */
  @Get(':userId')
  getProfile(@Param('userId') userId: string) {
    return this.service.getProfileByUserId(userId);
  }
}
