import { BadRequestException, Body, Controller, Delete, ForbiddenException, Get, NotFoundException, Param, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { IsEnum, IsInt, IsString, MaxLength, Max, Min } from 'class-validator';
import { createHash } from 'node:crypto';
import { StorageService } from './storage.service';
import { PrismaService } from '../../common/prisma/prisma.service';
import { AuditService } from '../../common/audit/audit.service';
import { CurrentUser, type AuthContext } from '../../common/auth';

class CreateUploadUrlDto {
  @IsString() @MaxLength(200) filename!: string;
  @IsString() mimeType!: string;
  @IsInt() @Min(1) @Max(25 * 1024 * 1024) sizeBytes!: number;
}

class FinalizeDto {
  @IsString() storageKey!: string;
  @IsString() @MaxLength(200) nombre!: string;
  @IsEnum([
    'ESTUDIO_LAB',
    'ESTUDIO_IMAGEN',
    'RECETA',
    'INDICACION',
    'INFORME',
    'CERTIFICADO',
    'CONSENTIMIENTO',
    'OTRO',
  ])
  tipo!: string;
  @IsString() mimeType!: string;
  @IsInt() @Min(1) sizeBytes!: number;
  @IsString() hashSha256!: string;
}

@ApiBearerAuth()
@ApiTags('storage')
@Controller('storage')
export class StorageController {
  constructor(
    private readonly storage: StorageService,
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
  ) {}

  @Post('upload-url')
  async createUploadUrl(@CurrentUser() user: AuthContext, @Body() dto: CreateUploadUrlDto) {
    if (!this.storage.validateMime(dto.mimeType)) {
      throw new BadRequestException(`Tipo de archivo no permitido: ${dto.mimeType}`);
    }
    return this.storage.createUploadUrl({
      userId: user.userId,
      filename: dto.filename,
      mimeType: dto.mimeType,
      sizeBytes: dto.sizeBytes,
    });
  }

  /**
   * Después de subir con PUT a uploadUrl, el cliente llama acá con la
   * storageKey, los metadatos y el hash SHA-256 del contenido.
   * Persistimos en ClinicalDocument.
   */
  @Post('finalize')
  async finalize(@CurrentUser() user: AuthContext, @Body() dto: FinalizeDto) {
    const profile = await this.prisma.client.citizenProfile.findUnique({
      where: { userId: user.userId },
    });
    if (!profile) {
      throw new BadRequestException('Necesitás crear tu Pulso ID antes de subir documentos.');
    }
    if (!dto.storageKey.startsWith(`users/${user.userId}/`)) {
      throw new ForbiddenException('storageKey no pertenece a tu cuenta.');
    }
    if (!/^[0-9a-f]{64}$/.test(dto.hashSha256)) {
      throw new BadRequestException('hashSha256 inválido.');
    }

    const doc = await this.prisma.client.clinicalDocument.create({
      data: {
        ciudadanoId: profile.id,
        tipo: dto.tipo as never,
        nombre: dto.nombre,
        storageKey: dto.storageKey,
        mimeType: dto.mimeType,
        sizeBytes: dto.sizeBytes,
        hashSha256: dto.hashSha256,
        uploadedBy: user.userId,
      },
    });
    await this.audit.append({
      actorId: user.userId,
      actorRole: user.role,
      action: 'CLINICAL_DOCUMENT_UPLOADED',
      targetType: 'ClinicalDocument',
      targetId: doc.id,
      outcome: 'SUCCESS',
      payload: { tipo: dto.tipo, sizeBytes: dto.sizeBytes },
    });
    return doc;
  }

  @Get(':id/download-url')
  async download(@CurrentUser() user: AuthContext, @Param('id') id: string) {
    const doc = await this.prisma.client.clinicalDocument.findUnique({
      where: { id },
      include: { ciudadano: true },
    });
    if (!doc) throw new NotFoundException('Documento no encontrado.');

    // Permite: el dueño del perfil, ADMIN+, o profesional con consent vigente.
    const isOwner = doc.ciudadano.userId === user.userId;
    const isAdmin = user.role === 'ADMIN' || user.role === 'SUPERADMIN';
    let allowed = isOwner || isAdmin;

    if (!allowed && user.role === 'PROFESIONAL') {
      const professional = await this.prisma.client.professionalProfile.findUnique({
        where: { userId: user.userId },
      });
      if (professional) {
        const consent = await this.prisma.client.consent.findFirst({
          where: {
            ciudadanoId: doc.ciudadano.userId,
            profesionalId: professional.id,
            revokedAt: null,
            scopes: { has: 'PERFIL_COMPLETO' },
            OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }],
          },
        });
        if (consent) allowed = true;
      }
    }

    if (!allowed) {
      throw new ForbiddenException('No tenés permiso para descargar este documento.');
    }

    const url = await this.storage.createDownloadUrl(doc.storageKey, 600);
    await this.audit.append({
      actorId: user.userId,
      actorRole: user.role,
      action: 'CLINICAL_DOCUMENT_DOWNLOADED',
      targetType: 'ClinicalDocument',
      targetId: doc.id,
      outcome: 'SUCCESS',
      payload: {},
    });
    return { url, expiresInSec: 600 };
  }

  @Delete(':id')
  async delete(@CurrentUser() user: AuthContext, @Param('id') id: string) {
    const doc = await this.prisma.client.clinicalDocument.findUnique({
      where: { id },
      include: { ciudadano: true },
    });
    if (!doc) throw new NotFoundException('Documento no encontrado.');
    if (doc.ciudadano.userId !== user.userId) {
      throw new ForbiddenException('Solo el dueño puede borrar el documento.');
    }
    await this.storage.deleteObject(doc.storageKey);
    await this.prisma.client.clinicalDocument.delete({ where: { id } });
    return { ok: true };
  }
}

// Helper exportado para el cliente: hashing del contenido SHA-256.
// Nota: el cliente debe calcular esto antes de subir.
export function hashFile(buffer: Buffer): string {
  return createHash('sha256').update(buffer).digest('hex');
}
