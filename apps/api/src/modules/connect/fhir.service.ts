import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';

/**
 * Adapter FHIR R4 para integración con HCEs externas.
 *
 * Mapea entidades Pulso → recursos FHIR R4:
 *   CitizenProfile → Patient
 *   ClinicalRecord (EVOLUCION/CONSULTA) → Encounter + Observation
 *   ClinicalRecord (ESTUDIO) → DiagnosticReport
 *   Prescription → MedicationRequest
 *   Allergy entries → AllergyIntolerance
 *   Medication entries → MedicationStatement
 *   Condicion entries → Condition
 *
 * Spec: https://hl7.org/fhir/R4/
 */
@Injectable()
export class FhirService {
  constructor(private readonly prisma: PrismaService) {}

  async getPatientByDni(dni: string) {
    const profile = await this.prisma.client.citizenProfile.findUnique({
      where: { dni },
      include: { user: { select: { email: true } } },
    });
    if (!profile) throw new NotFoundException('Patient not found');

    return {
      resourceType: 'Patient',
      id: profile.id,
      identifier: [
        {
          use: 'official',
          system: 'urn:oid:2.16.32.1.5.20.100.1', // DNI Argentina (placeholder OID)
          value: profile.dni,
          type: { coding: [{ system: 'http://terminology.hl7.org/CodeSystem/v2-0203', code: 'NI', display: 'National identifier' }] },
        },
        ...(profile.cuil
          ? [
              {
                use: 'secondary',
                system: 'urn:oid:2.16.32.1.5.20.100.2',
                value: profile.cuil,
                type: { coding: [{ system: 'pulso/cuil', code: 'CUIL', display: 'CUIL Argentina' }] },
              },
            ]
          : []),
      ],
      active: true,
      name: [{ use: 'official', family: profile.apellido, given: [profile.nombre] }],
      telecom: [
        ...(profile.telefono ? [{ system: 'phone', value: profile.telefono, use: 'mobile' }] : []),
        { system: 'email', value: profile.user.email, use: 'home' },
      ],
      gender: mapGender(profile.sexoBiologico),
      birthDate: profile.fechaNacimiento.toISOString().slice(0, 10),
      address: profile.localidad
        ? [{ use: 'home', city: profile.localidad, state: profile.provincia, country: 'AR' }]
        : [{ use: 'home', state: profile.provincia, country: 'AR' }],
      meta: {
        source: 'pulso.nativos.consulting',
        profile: ['http://hl7.org/fhir/StructureDefinition/Patient'],
      },
    };
  }

  async getAllergyIntolerancesByDni(dni: string) {
    const profile = await this.prisma.client.citizenProfile.findUnique({
      where: { dni },
      select: { id: true, alergias: true },
    });
    if (!profile) throw new NotFoundException('Patient not found');

    const alergias = profile.alergias as Array<{ sustancia: string; severidad: string; notas?: string }>;
    const entries = alergias.map((a, i) => ({
      fullUrl: `urn:uuid:allergy-${profile.id}-${i}`,
      resource: {
        resourceType: 'AllergyIntolerance',
        id: `${profile.id}-${i}`,
        clinicalStatus: { coding: [{ system: 'http://terminology.hl7.org/CodeSystem/allergyintolerance-clinical', code: 'active' }] },
        verificationStatus: { coding: [{ system: 'http://terminology.hl7.org/CodeSystem/allergyintolerance-verification', code: 'confirmed' }] },
        code: { text: a.sustancia },
        criticality: mapCriticality(a.severidad),
        patient: { reference: `Patient/${profile.id}` },
        note: a.notas ? [{ text: a.notas }] : undefined,
      },
    }));

    return {
      resourceType: 'Bundle',
      type: 'searchset',
      total: entries.length,
      entry: entries,
    };
  }

  async getMedicationStatementsByDni(dni: string) {
    const profile = await this.prisma.client.citizenProfile.findUnique({
      where: { dni },
      select: { id: true, medicacionHabitual: true },
    });
    if (!profile) throw new NotFoundException('Patient not found');

    const meds = profile.medicacionHabitual as Array<{
      nombre: string;
      presentacion?: string;
      posologia?: string;
      desde?: string;
    }>;
    const entries = meds.map((m, i) => ({
      fullUrl: `urn:uuid:medication-${profile.id}-${i}`,
      resource: {
        resourceType: 'MedicationStatement',
        id: `${profile.id}-${i}`,
        status: 'active',
        medicationCodeableConcept: {
          text: `${m.nombre}${m.presentacion ? ' · ' + m.presentacion : ''}`,
        },
        subject: { reference: `Patient/${profile.id}` },
        dosage: m.posologia ? [{ text: m.posologia }] : undefined,
        effectivePeriod: m.desde ? { start: m.desde } : undefined,
      },
    }));

    return {
      resourceType: 'Bundle',
      type: 'searchset',
      total: entries.length,
      entry: entries,
    };
  }
}

function mapGender(sexo: string): 'male' | 'female' | 'other' | 'unknown' {
  if (sexo === 'MASCULINO') return 'male';
  if (sexo === 'FEMENINO') return 'female';
  if (sexo === 'INTERSEXUAL') return 'other';
  return 'unknown';
}

function mapCriticality(severidad: string): 'low' | 'high' | 'unable-to-assess' {
  if (severidad === 'ANAFILACTICA' || severidad === 'SEVERA') return 'high';
  if (severidad === 'LEVE' || severidad === 'MODERADA') return 'low';
  return 'unable-to-assess';
}
