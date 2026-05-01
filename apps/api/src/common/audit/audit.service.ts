import { Injectable, Logger } from '@nestjs/common';
import { buildAuditRow, GENESIS_HASH, verifyChain } from '@pulso/audit';
import type { AuditEntryInput } from '@pulso/audit';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuditService {
  private readonly logger = new Logger('Audit');
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Append-only: registra una entrada hasheando contra la última fila.
   */
  async append(input: AuditEntryInput) {
    const last = await this.prisma.client.auditLog.findFirst({
      orderBy: { sequenceNum: 'desc' },
      select: { currentHash: true },
    });
    const previousHash = last?.currentHash ?? GENESIS_HASH;
    const row = buildAuditRow(input, previousHash);

    return this.prisma.client.auditLog.create({
      data: {
        actorId: row.actorId,
        actorRole: row.actorRole as never,
        action: row.action as never,
        targetType: row.targetType,
        targetId: row.targetId,
        outcome: row.outcome as never,
        ip: row.ip,
        userAgent: row.userAgent,
        payloadHash: row.payloadHash,
        previousHash: row.previousHash,
        currentHash: row.currentHash,
      },
    });
  }

  async verifyRange(opts: { from?: Date; to?: Date; limit?: number }) {
    const rows = await this.prisma.client.auditLog.findMany({
      where: {
        occurredAt: {
          gte: opts.from ?? undefined,
          lte: opts.to ?? undefined,
        },
      },
      orderBy: { sequenceNum: 'asc' },
      take: opts.limit ?? 1000,
    });
    const normalized = rows.map((r) => ({
      sequenceNum: r.sequenceNum,
      previousHash: r.previousHash,
      currentHash: r.currentHash,
      payloadHash: r.payloadHash,
      actorId: r.actorId,
      action: r.action as string,
      targetType: r.targetType,
      targetId: r.targetId,
      outcome: r.outcome as string,
      occurredAt: r.occurredAt.toISOString(),
    }));
    const expectedFirstPrev = rows[0]
      ? (await this.prisma.client.auditLog.findFirst({
          where: { sequenceNum: { lt: rows[0].sequenceNum } },
          orderBy: { sequenceNum: 'desc' },
          select: { currentHash: true },
        }))?.currentHash ?? GENESIS_HASH
      : GENESIS_HASH;
    return verifyChain(normalized, expectedFirstPrev);
  }
}
