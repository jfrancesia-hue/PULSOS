import { Controller, Get, Param } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Roles } from '../../common/auth';
import { FhirService } from './fhir.service';

@ApiBearerAuth()
@ApiTags('connect')
@Roles('INSTITUCION')
@Controller('connect')
export class ConnectController {
  constructor(private readonly fhir: FhirService) {}

  @Get('status')
  status() {
    return {
      ok: true,
      mode: 'ACTIVE',
      version: 'FHIR R4',
      categories: ['hl7-fhir', 'obras-sociales', 'farmacias', 'laboratorios'],
      capabilities: ['Patient.read', 'AllergyIntolerance.read', 'MedicationStatement.read'],
      docs: 'https://hl7.org/fhir/R4/',
    };
  }

  /**
   * GET /connect/fhir/Patient/dni/:dni
   * Devuelve el recurso Patient FHIR R4 para un DNI argentino.
   * Requiere rol INSTITUCION (cuenta institucional verificada).
   */
  @Get('fhir/Patient/dni/:dni')
  getPatient(@Param('dni') dni: string) {
    return this.fhir.getPatientByDni(dni);
  }

  /** Bundle de AllergyIntolerance del paciente. */
  @Get('fhir/Patient/dni/:dni/AllergyIntolerance')
  getAllergies(@Param('dni') dni: string) {
    return this.fhir.getAllergyIntolerancesByDni(dni);
  }

  /** Bundle de MedicationStatement del paciente. */
  @Get('fhir/Patient/dni/:dni/MedicationStatement')
  getMedications(@Param('dni') dni: string) {
    return this.fhir.getMedicationStatementsByDni(dni);
  }
}
