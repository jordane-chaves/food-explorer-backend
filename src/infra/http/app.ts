import cors from 'cors'
import express from 'express'
import '@/infra/adapters'

import { env } from '../env'
import { errorHandler } from './middlewares/error-handler'
import { routes } from './routes'

export const app = express()

app.use(express.json())
app.use(
  cors({
    credentials: true,
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
  }),
)

const storagePublicUrl = new URL(env.STORAGE_PUBLIC_URL)

app.use(storagePublicUrl.pathname, express.static('tmp'))

app.use(routes)

app.use(errorHandler)
