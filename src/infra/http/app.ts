import cors from 'cors'
import express from 'express'
import '@/infra/adapters'

import { errorHandler } from './middlewares/error-handler'
import { routes } from './routes'

export const app = express()

app.use(express.json())
app.use(cors())

app.use('/images', express.static('tmp'))

app.use(routes)

app.use(errorHandler)
