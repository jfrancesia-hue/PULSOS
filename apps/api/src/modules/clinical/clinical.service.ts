import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';

@Injectable()
export class ClinicalService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * NOTA: este endpoint en producción exige:
   *   - guard JWT con rol PROFESIONAL
   *   - verificación de matrícula vigente
   *   - verificación de Consent vigente del ciudadano hacia este profesional
   * Ver docs/CODEX_HANDOFF.md P0.5.
   */
  async searchByDni(dni: string) {
    if (!dni || !/^\d{7,9}$/.test(dni)) {
      throw new BadRequestException('DNI inválido. Solo números, sin puntos.');
    }
    return this.prisma.client.citizenProfile.findUnique({
      where: { dni },
      select: {
        id: true,
        nombre: true,
        apellido: true,
        provincia: true,
        grupoSanguineo: true,
        alergias: true,
        condicionesCriticas: true,
        medicacionHabitual: true,
      },
    });
  }

  timelineByCitizenId(citizenId: string) {
    return this.prisma.client.clinicalRecord.findMany({
      where: { ciudadanoId: citizenId },
      orderBy: { ocurridoEn: 'desc' },
      take: 50,
      include: {
        profesional: { select: { nombre: true, apellido: true, especialidades: true } },
        institucion: { select: { razonSocial: true, fantasyName: true } },
      },
    });
  }
}
