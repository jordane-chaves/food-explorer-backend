import { Request, Response } from 'express'
import { container } from 'tsyringe'

import { GetProfileUseCase } from '@/domain/account/application/use-cases/get-profile'
import { ResourceNotFoundError } from '@/domain/dish/application/use-cases/errors/resource-not-found-error'

import { BadRequestError } from '../../errors/bad-request-error'
import { HttpUserPresenter } from '../../presenters/http-user-presenter'

export class ProfileController {
  async handle(request: Request, response: Response) {
    const userId = request.user.id
    const getProfile = container.resolve(GetProfileUseCase)

    const result = await getProfile.execute({ userId })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case ResourceNotFoundError:
          throw new BadRequestError('User not found.')
        default:
          throw new BadRequestError()
      }
    }

    const { user } = result.value

    return response.status(200).json({
      user: HttpUserPresenter.toHTTP(user),
    })
  }
}
