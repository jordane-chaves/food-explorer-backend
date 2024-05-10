import { Request, Response } from 'express'
import { container } from 'tsyringe'
import { z } from 'zod'

import { CreateDishUseCase } from '@/domain/dish/application/use-cases/create-dish'

import { BadRequestError } from '../../errors/bad-request-error'

/**
 * @openapi
 * /dishes:
 *  post:
 *    tags: ['Dish']
 *    summary: Create dish
 *    description: Create a new dish
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
 *              price: 24.99
 *              ingredients:
 *                - alface
 *                - cebola
 *                - pão naan
 *                - pepino
 *                - rabanete
 *                - tomate
 *    responses:
 *      201:
 *        description: Dish created
 */
export class CreateDishController {
  async handle(request: Request, response: Response) {
    const createDishBodySchema = z.object({
      categoryId: z.string().uuid(),
      imageId: z.string().uuid(),
      name: z.string(),
      description: z.string(),
      price: z
        .number()
        .min(0)
        .transform((value) => Number(value.toFixed(2))),
      ingredients: z.string().array(),
    })

    const { categoryId, imageId, description, ingredients, name, price } =
      createDishBodySchema.parse(request.body)

    const priceInCents = price * 100

    const createDish = container.resolve(CreateDishUseCase)

    const result = await createDish.execute({
      categoryId,
      imageId,
      description,
      ingredients,
      name,
      priceInCents,
    })

    if (result.isLeft()) {
      throw new BadRequestError()
    }

    return response.status(201).send()
  }
}
