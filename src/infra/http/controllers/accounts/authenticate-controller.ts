import { Request, Response } from 'express'
import { container } from 'tsyringe'
import { z } from 'zod'

import authConfig from '@/config/auth'
import { AuthenticateUseCase } from '@/domain/account/application/use-cases/authenticate'
import { WrongCredentialsError } from '@/domain/account/application/use-cases/errors/wrong-credentials-error'

import { BadRequestError } from '../../errors/bad-request-error'
import { UnauthorizedError } from '../../errors/unauthorized-error'

/**
 * @openapi
 * /sessions:
 *  post:
 *    tags: ['Account']
 *    summary: Authenticate user
 *    description: Create user session
 *    security: []
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            required:
 *              email
 *              password
 *            type: object
 *            properties:
 *              email:
 *                type: string
 *              password:
 *                type: string
 *            example:
 *              email: 'johndoe@example.com'
 *              password: '123456'
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
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/ValidationError'
 *              example:
 *                message: Validation error
 *                fields:
 *                  email: ['Invalid email']
 *                statusCode: 400
 *      401:
 *        description: Unauthorized
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/GeneralError'
 *              example:
 *                message: Wrong credentials
 *                statusCode: 401
 */
export class AuthenticateController {
  async handle(request: Request, response: Response) {
    const authenticateBodySchema = z.object({
      email: z.string().email(),
      password: z.string(),
    })

    const { email, password } = authenticateBodySchema.parse(request.body)

    const authenticate = container.resolve(AuthenticateUseCase)

    const result = await authenticate.execute({
      email,
      password,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case WrongCredentialsError:
          throw new UnauthorizedError(error.message)
        default:
          throw new BadRequestError()
      }
    }

    const { accessToken, refreshToken } = result.value

    return response
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
