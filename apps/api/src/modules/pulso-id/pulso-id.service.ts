import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';

@Injectable()
export class PulsoIdService {
  constructor(private readonly prisma: PrismaService) {}

  async getProfileByUserId(userId: string) {
    const profile = await this.prisma.client.citizenProfile.findUnique({
      where: { userId },
    });
    if (!profile) throw new NotFoundException('Perfil ciudadano no encontrado.');
    return profile;
  }
}
