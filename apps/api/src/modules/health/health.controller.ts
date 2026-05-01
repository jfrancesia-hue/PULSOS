import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Public } from '../../common/auth';
import { PrismaService } from '../../common/prisma/prisma.service';
import { AuditService } from '../../common/audit/audit.service';

@ApiTags('health')
@Controller('health')
export class HealthController {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
  ) {}

  /**
   * Liveness simple: el proceso responde HTTP. Sin chequeos costosos.
   * Apto para load balancers / k8s liveness probes.
   */
  @Public()
  @Get()
  check() {
    return {
      ok: true,
      service: 'pulso-api',
      version: '0.2.0',
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Readiness: verifica DB + audit chain. Apto para readiness probe.
   * Devuelve 200 si todo OK, 503 (lanzando excepción) si algo falla.
   */
  @Public()
  @Get('ready')
  async ready() {
    const dbStart = Date.now();
    await this.prisma.client.$queryRawUnsafe('SELECT 1');
    const dbLatencyMs = Date.now() - dbStart;

    const chainStart = Date.now();
    const chain = await this.audit.verifyRange({ limit: 100 });
    const chainLatencyMs = Date.now() - chainStart;

    return {
      ok: true,
      service: 'pulso-api',
      version: '0.2.0',
      timestamp: new Date().toISOString(),
      checks: {
        database: { ok: true, latencyMs: dbLatencyMs },
        auditChain: {
          ok: chain.ok,
          rowsChecked: chain.totalChecked,
          latencyMs: chainLatencyMs,
        },
      },
    };
  }
}
