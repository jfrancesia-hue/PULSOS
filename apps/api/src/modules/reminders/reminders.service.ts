import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';

interface CreateInput {
  medicacion: string;
  presentacion?: string;
  posologia?: string;
  frequency: string;
  hours: string[];
  startDate: string;
  endDate?: string;
}

@Injectable()
export class RemindersService {
  constructor(private readonly prisma: PrismaService) {}

  list(userId: string) {
    return this.prisma.client.medicationReminder.findMany({
      where: { userId },
      orderBy: [{ active: 'desc' }, { medicacion: 'asc' }],
    });
  }

  create(userId: string, dto: CreateInput) {
    return this.prisma.client.medicationReminder.create({
      data: {
        userId,
        medicacion: dto.medicacion,
        presentacion: dto.presentacion,
        posologia: dto.posologia,
        frequency: dto.frequency as never,
        hours: dto.hours,
        startDate: new Date(dto.startDate),
        endDate: dto.endDate ? new Date(dto.endDate) : null,
      },
    });
  }

  async update(userId: string, id: string, dto: { active?: boolean; hours?: string[]; endDate?: string }) {
    const existing = await this.prisma.client.medicationReminder.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Recordatorio no encontrado.');
    if (existing.userId !== userId) throw new ForbiddenException('No es tuyo.');
    return this.prisma.client.medicationReminder.update({
      where: { id },
      data: {
        active: dto.active ?? existing.active,
        hours: dto.hours ?? existing.hours,
        endDate: dto.endDate ? new Date(dto.endDate) : existing.endDate,
      },
    });
  }

  async remove(userId: string, id: string) {
    const existing = await this.prisma.client.medicationReminder.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Recordatorio no encontrado.');
    if (existing.userId !== userId) throw new ForbiddenException('No es tuyo.');
    await this.prisma.client.medicationReminder.delete({ where: { id } });
    return { ok: true };
  }
}
