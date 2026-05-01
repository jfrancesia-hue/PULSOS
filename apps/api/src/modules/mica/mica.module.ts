import { Module } from '@nestjs/common';
import { MicaController } from './mica.controller';
import { MicaService } from './mica.service';

@Module({
  controllers: [MicaController],
  providers: [MicaService],
  exports: [MicaService],
})
export class MicaModule {}
