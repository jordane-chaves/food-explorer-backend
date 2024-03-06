import { HttpStatus } from '@/core/enums/http-status.enum'

import { HttpError } from './http-error'

export class UnauthorizedError extends HttpError {
  /**
   * The HTTP response status code will be 401.
   *
   * @example
   * `throw new UnauthorizedError()`
   *
   * @param message error description; by default is `"Unauthorized"`
   */
  constructor(message: string = 'Unauthorized') {
    super(message, HttpStatus.UNAUTHORIZED)
  }
}
