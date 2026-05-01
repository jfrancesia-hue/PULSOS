import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  findById(id: string) {
    return this.prisma.client.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        role: true,
        status: true,
        mfaEnabled: true,
        emailVerifiedAt: true,
        createdAt: true,
        citizenProfile: { select: { dni: true, nombre: true, apellido: true, provincia: true } },
        professionalProfile: { select: { matriculaNacional: true, especialidades: true } },
      },
    });
  }
}
