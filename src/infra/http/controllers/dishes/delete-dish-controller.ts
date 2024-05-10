import { Request, Response } from 'express'
import { container } from 'tsyringe'
import { z } from 'zod'

import { DeleteDishUseCase } from '@/domain/dish/application/use-cases/delete-dish'

import { BadRequestError } from '../../errors/bad-request-error'

/**
 * @openapi
 * /dishes/{dishId}:
 *  delete:
 *    tags: ['Dish']
 *    summary: Delete dish
 *    description: Delete a new dish
 *    parameters:
 *      - dishId:
 *        name: dishId
 *        description: ID of the dish you want to delete
 *        in: path
 *        required: true
 *        schema:
 *          type: string
 *          format: uuid
 *    responses:
 *      204:
 *        description: Dish deleted
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
export class DeleteDishController {
  async handle(request: Request, response: Response) {
    const deleteDishParamsSchema = z.object({
      dishId: z.string().uuid(),
    })

    const { dishId } = deleteDishParamsSchema.parse(request.params)

    const deleteDish = container.resolve(DeleteDishUseCase)

    const result = await deleteDish.execute({
      dishId,
    })

    if (result.isLeft()) {
      throw new BadRequestError()
    }

    return response.status(204).send()
  }
}
