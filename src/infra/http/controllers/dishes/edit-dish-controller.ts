import { Request, Response } from 'express'
import { container } from 'tsyringe'
import { z } from 'zod'

import { EditDishUseCase } from '@/domain/dish/application/use-cases/edit-dish'
import { ResourceNotFoundError } from '@/domain/dish/application/use-cases/errors/resource-not-found-error'

import { BadRequestError } from '../../errors/bad-request-error'

/**
 * @openapi
 * /dishes/{dishId}:
 *  put:
 *    tags: ['Dish']
 *    summary: Edit dish
 *    description: Edit a dish
 *    parameters:
 *      - dishId:
 *        name: dishId
 *        description: ID of the dish you want to edit
 *        in: path
 *        required: true
 *        schema:
 *          type: string
 *          format: uuid
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            required:
 *              categoryId
 *              imageId
 *              name
 *              description
 *              price
 *              ingredients
 *            type: object
 *            properties:
 *              categoryId:
 *                type: string
 *                format: uuid
 *              imageId:
 *                type: string
 *                format: uuid
 *              name:
 *                type: string
 *              description:
 *                type: string
 *              price:
 *                type: number
 *                format: float
 *                minimum: 0
 *              ingredients:
 *                type: array
 *                items:
 *                  type: string
 *            example:
 *              categoryId: 5e5207c1-5009-4c14-b9da-d92517c8835e
 *              imageId: d24c49b7-fa69-415c-9d11-a95733881d30
 *              name: Salada Ravanello
 *              description: Rabanetes, folhas verdes e molho agridoce salpicados com gergelim. O pão naan dá um toque especial.
 *              price: 39.99
 *              ingredients:
 *                - alface
 *                - cebola
 *                - pão naan
 *                - pepino
 *                - rabanete
 *                - tomate
 *    responses:
 *      204:
 *        description: Dish edited
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
export class EditDishController {
  async handle(request: Request, response: Response) {
    const editDishParamsSchema = z.object({
      dishId: z.string().uuid(),
    })

    const { dishId } = editDishParamsSchema.parse(request.params)

    const editDishBodySchema = z.object({
      categoryId: z.string().uuid(),
      imageId: z.string().uuid(),
      ingredients: z.string().array(),
      name: z.string(),
      description: z.string(),
      price: z
        .number()
        .min(0)
        .transform((value) => Number(value.toFixed(2))),
    })

    const { categoryId, imageId, description, ingredients, name, price } =
      editDishBodySchema.parse(request.body)

    const priceInCents = price * 100

    const editDish = container.resolve(EditDishUseCase)

    const result = await editDish.execute({
      dishId,
      categoryId,
      imageId,
      description,
      ingredients,
      name,
      priceInCents,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case ResourceNotFoundError:
          throw new BadRequestError(error.message)
        default:
          throw new BadRequestError()
      }
    }

    return response.status(204).send()
  }
}
