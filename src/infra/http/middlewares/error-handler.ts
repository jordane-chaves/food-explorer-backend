import 'express-async-errors'

import { Request, Response, NextFunction } from 'express'
import { ZodError } from 'zod'

import { env } from '@/infra/env'

import { HttpError } from '../errors/http-error'

export function errorHandler(
  error: Error,
  request: Request,
  response: Response,
  next: NextFunction,
) {
  if (error instanceof ZodError) {
    return response.status(400).json({
      statusCode: 400,
      message: 'Validation error',
      issues: error.format(),
    })
  }

  if (error instanceof HttpError) {
    return response.status(error.statusCode).json({
      statusCode: error.statusCode,
      message: error.message,
    })
  }

  if (env.NODE_ENV !== 'production') {
    console.error(error)
  } else {
    // TODO: Here we should log to an external tool like DataDog/Newrelic/Sentry
  }

  return response.status(500).json({
    statusCode: 500,
    message: 'Internal server error',
  })
}
