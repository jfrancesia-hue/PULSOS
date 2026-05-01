import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { S3Client, HeadBucketCommand, CreateBucketCommand, GetObjectCommand, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { randomUUID } from 'node:crypto';

const ALLOWED_MIME = new Set([
  'application/pdf',
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/heic',
  'image/heif',
  'text/plain',
]);

const MAX_BYTES = 25 * 1024 * 1024; // 25 MB

@Injectable()
export class StorageService implements OnModuleInit {
  private readonly logger = new Logger('Storage');
  private client: S3Client;
  private bucket: string;

  constructor() {
    const endpoint = process.env.S3_ENDPOINT ?? 'http://localhost:9000';
    const region = process.env.S3_REGION ?? 'us-east-1';
    this.bucket = process.env.S3_BUCKET ?? 'pulso-clinical';
    this.client = new S3Client({
      endpoint,
      region,
      credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY ?? 'pulso',
        secretAccessKey: process.env.S3_SECRET_KEY ?? 'pulso-minio-dev',
      },
      forcePathStyle: true,
    });
  }

  async onModuleInit() {
    try {
      await this.client.send(new HeadBucketCommand({ Bucket: this.bucket }));
      this.logger.log(`Bucket ${this.bucket} disponible.`);
    } catch {
      try {
        await this.client.send(new CreateBucketCommand({ Bucket: this.bucket }));
        this.logger.log(`Bucket ${this.bucket} creado.`);
      } catch (e) {
        this.logger.warn(
          `No se pudo verificar/crear bucket ${this.bucket}: ${(e as Error).message}. Storage no disponible.`,
        );
      }
    }
  }

  validateMime(mimeType: string): boolean {
    return ALLOWED_MIME.has(mimeType);
  }

  validateSize(sizeBytes: number): boolean {
    return sizeBytes > 0 && sizeBytes <= MAX_BYTES;
  }

  /**
   * Genera una URL presignada de upload directo desde el cliente.
   * El cliente hace PUT a esta URL con el archivo. Cuando termina,
   * llama al endpoint /storage/finalize para registrar el documento.
   */
  async createUploadUrl(opts: {
    userId: string;
    filename: string;
    mimeType: string;
    sizeBytes: number;
  }): Promise<{ uploadUrl: string; storageKey: string; expiresInSec: number }> {
    if (!this.validateMime(opts.mimeType)) {
      throw new Error(`Tipo de archivo no permitido: ${opts.mimeType}`);
    }
    if (!this.validateSize(opts.sizeBytes)) {
      throw new Error(`Archivo fuera de tamaño permitido (máx ${MAX_BYTES / 1024 / 1024}MB).`);
    }
    const ext = (opts.filename.match(/\.[a-zA-Z0-9]+$/)?.[0] ?? '').toLowerCase();
    const storageKey = `users/${opts.userId}/${randomUUID()}${ext}`;
    const cmd = new PutObjectCommand({
      Bucket: this.bucket,
      Key: storageKey,
      ContentType: opts.mimeType,
      ContentLength: opts.sizeBytes,
    });
    const uploadUrl = await getSignedUrl(this.client, cmd, { expiresIn: 600 });
    return { uploadUrl, storageKey, expiresInSec: 600 };
  }

  async createDownloadUrl(storageKey: string, expiresInSec = 600): Promise<string> {
    const cmd = new GetObjectCommand({ Bucket: this.bucket, Key: storageKey });
    return getSignedUrl(this.client, cmd, { expiresIn: expiresInSec });
  }

  async deleteObject(storageKey: string): Promise<void> {
    await this.client.send(new DeleteObjectCommand({ Bucket: this.bucket, Key: storageKey }));
  }

  get bucketName(): string {
    return this.bucket;
  }
}
