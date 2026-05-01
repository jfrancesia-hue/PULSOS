import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ClinicalService } from './clinical.service';

@ApiTags('clinical')
@Controller('clinical')
export class ClinicalController {
  constructor(private readonly service: ClinicalService) {}

  @Get('search')
  search(@Query('dni') dni: string) {
    return this.service.searchByDni(dni);
  }

  @Get(':citizenId/timeline')
  timeline(@Param('citizenId') citizenId: string) {
    return this.service.timelineByCitizenId(citizenId);
  }
}
