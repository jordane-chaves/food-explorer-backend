import { HttpStatus } from '@/core/enums/http-status.enum'

import { HttpError } from './http-error'

export class ConflictError extends HttpError {
  /**
   * The HTTP response status code will be 409.
   *
   * @example
   * `throw new ConflictError()`
   *
   * @param message error description; by default is `"Conflict"`
   */
  constructor(message: string = 'Conflict') {
    super(message, HttpStatus.CONFLICT)
  }
}
