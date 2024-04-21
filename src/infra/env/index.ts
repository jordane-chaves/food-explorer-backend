import { config } from 'dotenv'
import { expand } from 'dotenv-expand'
import { z } from 'zod'

expand(config({ path: '.env' }))

const envSchema = z.object({
  NODE_ENV: z.enum(['dev', 'production', 'test']).default('dev'),
  PORT: z.coerce.number().optional().default(3333),
  DATABASE_URL: z.string().url(),
  JWT_SECRET: z.string(),
  STORAGE_PUBLIC_URL: z.string().url(),
  ORIGINS: z
    .string()
    .transform((value) => value.split(',').map((link) => link.trim()))
    .optional()
    .or(z.boolean().optional())
    .default(true),
})

const envParsed = envSchema.safeParse(process.env)

if (envParsed.success === false) {
  console.error('⚠️ Invalid environment variables.', envParsed.error.format())

  throw new Error('⚠️ Invalid environment variables.')
}

export const env = envParsed.data
