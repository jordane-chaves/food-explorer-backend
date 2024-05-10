import { Request, Response } from 'express'
import { container } from 'tsyringe'
import { z } from 'zod'

import { ResourceNotFoundError } from '@/domain/dish/application/use-cases/errors/resource-not-found-error'
import { GetDishUseCase } from '@/domain/dish/application/use-cases/get-dish'

import { BadRequestError } from '../../errors/bad-request-error'
import { HttpDishDetailsPresenter } from '../../presenters/http-dish-details-presenter'

/**
 * @openapi
 * /dishes/{dishId}:
 *  get:
 *    tags: ['Dish']
 *    summary: Get Dish
 *    description: Get dish details
 *    parameters:
 *      - dishId:
 *        name: dishId
 *        description: ID of the dish you want to get
 *        in: path
 *        required: true
 *        schema:
 *          type: string
 *          format: uuid
 *    responses:
 *      200:
 *        description: Return success response.
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                dish:
 *                  $ref: '#/components/schemas/Dish'
 *      400:
 *        description: Bad request
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/GeneralError'
 *              example:
 *                message: Dish not found.
 *                statusCode: 400
 */
export class GetDishController {
  async handle(request: Request, response: Response) {
    const getDishParamsSchema = z.object({
      dishId: z.string().uuid(),
    })

    const { dishId } = getDishParamsSchema.parse(request.params)

    const getDish = container.resolve(GetDishUseCase)

    const result = await getDish.execute({ dishId })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case ResourceNotFoundError:
          throw new BadRequestError('Dish not found.')
        default:
          throw new BadRequestError()
      }
    }

    const { dish } = result.value

    return response.status(200).json({
      dish: HttpDishDetailsPresenter.toHTTP(dish),
    })
  }
}
