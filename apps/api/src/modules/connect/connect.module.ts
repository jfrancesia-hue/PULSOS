import { Module } from '@nestjs/common';
import { ConnectController } from './connect.controller';
import { FhirService } from './fhir.service';

@Module({
  controllers: [ConnectController],
  providers: [FhirService],
  exports: [FhirService],
})
export class ConnectModule {}
