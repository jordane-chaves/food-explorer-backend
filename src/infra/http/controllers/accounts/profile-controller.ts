import { Request, Response } from 'express'
import { container } from 'tsyringe'

import { GetProfileUseCase } from '@/domain/account/application/use-cases/get-profile'
import { ResourceNotFoundError } from '@/domain/dish/application/use-cases/errors/resource-not-found-error'

import { BadRequestError } from '../../errors/bad-request-error'
import { HttpUserPresenter } from '../../presenters/http-user-presenter'

/**
 * @openapi
 * /profile:
 *  get:
 *    tags: ['Account']
 *    summary: Get profile
 *    description: Get authenticated user profile
 *    responses:
 *      200:
 *        description: Returns success response.
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                user:
 *                  type: object
 *                  properties:
 *                    id:
 *                      type: string
 *                    name:
 *                      type: string
 *                    email:
 *                      type: string
 *                    role:
 *                      type: string
 *              example:
 *                user:
 *                  id: 0473954a-2046-46c6-8a6f-b740aa36658b
 *                  name: John Doe
 *                  email: johndoe@example.com
 *                  role: customer
 *      400:
 *        description: Bad request
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/GeneralError'
 *              example:
 *                message: User not found
 *                statusCode: 400
 */
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
