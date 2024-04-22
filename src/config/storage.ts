import { env } from '@/infra/env'
import { S3ClientConfig } from '@aws-sdk/client-s3'

interface StorageConfig {
  driver: 'local' | 'r2'

  publicUrl: string

  config: {
    local: object
    r2: S3ClientConfig
  }
}

const cloudFlareAccountId = env.CLOUDFLARE_ACCOUNT_ID

export default {
  driver: env.STORAGE_PROVIDER,

  publicUrl: env.STORAGE_PUBLIC_URL,

  config: {
    local: {},

    r2: {
      endpoint: `https://${cloudFlareAccountId}.r2.cloudflarestorage.com`,
      region: 'auto',
      credentials: {
        accessKeyId: env.AWS_ACCESS_KEY_ID,
        secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
      },
    },
  },
} satisfies StorageConfig
