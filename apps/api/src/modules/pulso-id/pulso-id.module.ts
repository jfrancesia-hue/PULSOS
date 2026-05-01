import { Module } from '@nestjs/common';
import { PulsoIdController } from './pulso-id.controller';
import { PulsoIdService } from './pulso-id.service';

@Module({
  controllers: [PulsoIdController],
  providers: [PulsoIdService],
  exports: [PulsoIdService],
})
export class PulsoIdModule {}
