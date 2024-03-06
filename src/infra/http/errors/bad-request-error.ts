import { HttpStatus } from '@/core/enums/http-status.enum'

import { HttpError } from './http-error'

export class BadRequestError extends HttpError {
  /**
   * The HTTP response status code will be 400.
   *
   * @example
   * `throw new BadRequestError()`
   *
   * @param message error description; by default is `"Bad request"`
   */
  constructor(message: string = 'Bad request') {
    super(message, HttpStatus.BAD_REQUEST)
  }
}
