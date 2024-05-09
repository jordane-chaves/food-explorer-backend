import { Request, Response } from 'express'
import { container } from 'tsyringe'

import authConfig from '@/config/auth'
import { InvalidTokenError } from '@/domain/account/application/use-cases/errors/invalid-token-error'
import { RefreshTokenUseCase } from '@/domain/account/application/use-cases/refresh-token'

import { BadRequestError } from '../../errors/bad-request-error'
import { UnauthorizedError } from '../../errors/unauthorized-error'

/**
 * @openapi
 * /token/refresh:
 *  patch:
 *    tags: ['Account']
 *    summary: Refresh token
 *    description: Generates a new access token via a refresh token
 *    security: []
 *    parameters:
 *      - name: refreshToken
 *        in: cookie
 *        required: true
 *        schema:
 *          type: string
 *          example: eyJhbGciOiJIUzI1NiIsIn...
 *    responses:
 *      200:
 *        description: >
 *          Returns success response. <br>
 *          The **access token** is returned in the response body.
 *          You need to include this token in subsequent requests.
 *        headers:
 *          Set-Cookie:
 *            schema:
 *              type: string
 *              example: refreshToken=eyJhbGciOiJIUzI1NiIsInR5c...; Expires=Fri, 29 Mar 2024 15:21:14 GMT; Max-Age=604800; Path=/; Secure; HttpOnly; SameSite=Strict; Domain=localhost
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                access_token:
 *                  type: string
 *              example:
 *                access_token: eyJhbGciOiJIUzI1NiIsIn...
 *      400:
 *        description: Bad request
 *      401:
 *        description: Unauthorized
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/GeneralError'
 *              example:
 *                message: Invalid Token
 *                statusCode: 401
 */
export class RefreshTokenController {
  async handle(request: Request, response: Response) {
    const cookies = request.headers.cookie

    if (!cookies) {
      throw new UnauthorizedError('Token missing')
    }

    const [, token] = cookies.split('refreshToken=')

    const refreshTokenUseCase = container.resolve(RefreshTokenUseCase)

    const result = await refreshTokenUseCase.execute({ token })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case InvalidTokenError:
          throw new UnauthorizedError(error.message)
        default:
          throw new BadRequestError()
      }
    }

    const { accessToken, refreshToken } = result.value

    return response
      .status(200)
      .cookie('refreshToken', refreshToken, {
        path: '/',
        httpOnly: true,
        sameSite: 'none',
        secure: true,
        maxAge: authConfig.refreshTokenExpiresInMilliseconds,
      })
      .json({
        access_token: accessToken,
      })
  }
}
