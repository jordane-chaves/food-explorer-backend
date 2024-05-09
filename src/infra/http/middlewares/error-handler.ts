import 'express-async-errors'

import { NextFunction, Request, Response } from 'express'
import { ZodError } from 'zod'

import { env } from '@/infra/env'

import { HttpError } from '../errors/http-error'

export function errorHandler(
  error: Error,
  request: Request,
  response: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction,
) {
  if (error instanceof ZodError) {
    return response.status(400).json({
      message: 'Validation error',
      fields: error.flatten().fieldErrors,
      statusCode: 400,
    })
  }

  if (error instanceof HttpError) {
    return response.status(error.statusCode).json({
      message: error.message,
      statusCode: error.statusCode,
    })
  }

  if (env.NODE_ENV !== 'production') {
    console.error(error)
  } else {
    // TODO: Here we should log to an external tool like DataDog/Newrelic/Sentry
  }

  return response.status(500).json({
    message: 'Internal server error',
    statusCode: 500,
  })
}
