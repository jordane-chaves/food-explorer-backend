import '@/infra/adapters'
import cors from 'cors'
import express from 'express'

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

app.use('/images', express.static('tmp'))
app.use(routes)
app.use(errorHandler)
