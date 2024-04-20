import { Request, Response } from 'express'
import { container } from 'tsyringe'
import { z } from 'zod'

import authConfig from '@/config/auth'
import { AuthenticateUseCase } from '@/domain/account/application/use-cases/authenticate'
import { WrongCredentialsError } from '@/domain/account/application/use-cases/errors/wrong-credentials-error'

import { BadRequestError } from '../../errors/bad-request-error'
import { UnauthorizedError } from '../../errors/unauthorized-error'

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
