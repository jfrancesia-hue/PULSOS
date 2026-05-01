import { Injectable, OnModuleDestroy, OnModuleInit, Logger } from '@nestjs/common';
import { prisma } from '@pulso/db';

@Injectable()
export class PrismaService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger('Prisma');
  readonly client = prisma;

  async onModuleInit() {
    await this.client.$connect();
    this.logger.log('Conectado a la base de datos.');
  }

  async onModuleDestroy() {
    await this.client.$disconnect();
  }
}
