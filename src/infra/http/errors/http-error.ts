import { HttpStatus } from '@/core/enums/http-status.enum'
import { HttpResponseError } from '@/core/errors/http-response-error'

export class HttpError extends Error implements HttpResponseError {
  statusCode: number

  constructor(message: string, statusCode: HttpStatus) {
    super(message)
    this.statusCode = statusCode
  }
}
