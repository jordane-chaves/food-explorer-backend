import '@/infra/adapters'
import cors from 'cors'
import express from 'express'

import { apiReference } from '@scalar/express-api-reference'

import { openapiSpecification } from '../docs/openapi-specification'
import { env } from '../env'
import { errorHandler } from './middlewares/error-handler'
import { routes } from './routes'

export const app = express()

app.use(express.json())
app.use(
  cors({
    credentials: true,
    origin: env.ORIGINS,
  }),
)

app.use(
  '/docs',
  apiReference({
    hideDownloadButton: true,
    spec: {
      content: openapiSpecification,
    },
  }),
)

app.use('/images', express.static('tmp'))
app.use(routes)
app.use(errorHandler)
