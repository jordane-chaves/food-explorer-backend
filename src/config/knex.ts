import { Knex } from 'knex'

import { env } from '@/infra/env'

export const config: Knex.Config = {
  client: 'pg',
  connection: env.DATABASE_URL,
  migrations: {
    extension: 'ts',
    directory: './src/infra/database/knex/migrations',
  },
}
