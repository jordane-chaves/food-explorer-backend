import { knex as setupKnex } from 'knex'

import { config } from '@/config/knex'

export const knex = setupKnex(config)
