import { randomUUID } from 'node:crypto'

import { Remover } from '@/domain/dish/application/storage/remover'
import {
  UploadParams,
  Uploader,
} from '@/domain/dish/application/storage/uploader'
import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
  S3ClientConfig,
} from '@aws-sdk/client-s3'

import { env } from '../env'

export class R2Storage implements Uploader, Remover {
  private client: S3Client

  constructor(config: S3ClientConfig) {
    this.client = new S3Client(config)
  }

  async upload({
    fileName,
    fileType,
    body,
  }: UploadParams): Promise<{ url: string }> {
    const uploadId = randomUUID()
    const uniqueFileName = `${uploadId}-${fileName}`

    await this.client.send(
      new PutObjectCommand({
        Bucket: env.AWS_BUCKET_NAME,
        Key: uniqueFileName,
        ContentType: fileType,
        Body: body,
      }),
    )

    return {
      url: uniqueFileName,
    }
  }

  async remove(fileName: string): Promise<void> {
    await this.client.send(
      new DeleteObjectCommand({
        Bucket: env.AWS_BUCKET_NAME,
        Key: fileName,
      }),
    )
  }
}
