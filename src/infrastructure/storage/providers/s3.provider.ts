import { Injectable, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { v4 as uuidv4 } from 'uuid';
import * as path from 'path';
import { IStorageProvider, IStorageFile } from '@core/services/storage.service';
import { File } from '@core/entities/file.entity';
import { IFileRepository } from '@core/repositories/file.repository.interface';

@Injectable()
export class S3StorageProvider implements IStorageProvider {
  private readonly s3Client: S3Client;
  private readonly publicBucket: string;
  private readonly privateBucket: string;

  constructor(
    private readonly configService: ConfigService,
    @Inject('IFileRepository') private readonly fileRepository: IFileRepository,
  ) {
    const awsConfig = this.configService.get('storage.aws');
    this.publicBucket = awsConfig.publicBucket;
    this.privateBucket = awsConfig.privateBucket;

    // Check if we're using a custom endpoint (like Supabase)
    const endpoint = this.configService.get('storage.publicUrl');
    const isCustomEndpoint = endpoint && !endpoint.includes('amazonaws.com');

    this.s3Client = new S3Client({
      region: awsConfig.region,
      credentials: {
        accessKeyId: awsConfig.accessKeyId,
        secretAccessKey: awsConfig.secretAccessKey,
      },
      ...(isCustomEndpoint && {
        endpoint: endpoint,
        forcePathStyle: true, // Needed for non-AWS S3 implementations
      }),
    });

    console.log('S3 Client Configuration:');
    console.log('Region:', awsConfig.region);
    console.log('Public Bucket:', this.publicBucket);
    console.log('Private Bucket:', this.privateBucket);
    console.log('Using Custom Endpoint:', isCustomEndpoint);
    console.log('Endpoint:', isCustomEndpoint ? endpoint : 'AWS Default');
  }

  async upload(file: IStorageFile, userId?: string): Promise<File> {
    const filename = `${uuidv4()}${path.extname(file.originalname)}`;
    const isPublic = this.isPublicFile(file.mimetype);
    const bucket = isPublic ? this.publicBucket : this.privateBucket;
    const filePath = userId ? `${userId}/${filename}` : filename;

    const params = {
      Bucket: bucket,
      Key: filePath,
      Body: file.buffer,
      ContentType: file.mimetype,
    };

    console.log('Uploading file to S3:', params);
    console.log('File buffer size:', file.buffer.length);
    console.log('File size:', file.size);
    console.log('File path:', filePath);
    console.log('Bucket:', bucket);
    console.log('User ID:', userId);
    console.log('Is public:', isPublic);
    console.log('File name:', filename);
    console.log('File original name:', file.originalname);

    await this.s3Client.send(new PutObjectCommand(params));

    const fileEntity = new File(
      filename,
      file.originalname,
      filePath,
      file.mimetype,
      file.size,
      bucket,
      userId || null,
      isPublic,
    );

    return this.fileRepository.save(fileEntity);
  }

  async getSignedUrl(file: File): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: file.bucket,
      Key: file.path,
    });

    // URL expires in 24 hours
    return getSignedUrl(this.s3Client, command, { expiresIn: 60 * 60 * 24 });
  }

  async delete(file: File): Promise<void> {
    const params = {
      Bucket: file.bucket,
      Key: file.path,
    };

    await this.s3Client.send(new DeleteObjectCommand(params));
  }

  private isPublicFile(mimeType: string): boolean {
    // Consider images and PDFs as public by default
    return mimeType.startsWith('image/') || mimeType === 'application/pdf';
  }
}
