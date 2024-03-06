import { Knex } from 'knex'

import { env } from '@/infra/env'

const connectionConfig =
  env.DATABASE_CLIENT === 'sqlite3'
    ? {
        filename: env.DATABASE_URL,
        flags: ['OPEN_URI'],
      }
    : env.DATABASE_URL

export const config: Knex.Config = {
  client: env.DATABASE_CLIENT,
  connection: connectionConfig,
  useNullAsDefault: true,
  migrations: {
    extension: 'ts',
    directory: './src/infra/database/knex/migrations',
  },
}
