import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('connect')
@Controller('connect')
export class ConnectController {
  /**
   * Pulso Connect es una capa preparada pero no implementada en el MVP.
   * Ver docs/MVP_SCOPE.md y docs/CODEX_HANDOFF.md P2.1.
   */
  @Get('status')
  status() {
    return {
      ok: true,
      mode: 'PREVIEW',
      categories: ['hl7', 'obras-sociales', 'farmacias', 'laboratorios'],
      message:
        'Pulso Connect está en modo preview. Ver docs/MVP_SCOPE.md → módulo Pulso Connect.',
    };
  }
}
