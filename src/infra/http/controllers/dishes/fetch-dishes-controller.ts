import { Request, Response } from 'express'
import { container } from 'tsyringe'
import { z } from 'zod'

import { FetchDishesUseCase } from '@/domain/dish/application/use-cases/fetch-dishes'

import { BadRequestError } from '../../errors/bad-request-error'
import { HttpDishDetailsPresenter } from '../../presenters/http-dish-details-presenter'

/**
 * @openapi
 * /dishes:
 *  get:
 *    tags: ['Dish']
 *    summary: List dishes
 *    description: Search many dishes
 *    parameters:
 *      - query:
 *        name: query
 *        description: The search can be done by name or ingredients
 *        in: query
 *        required: false
 *        schema:
 *          type: string
 *    responses:
 *      200:
 *        description: Return success response.
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                dishes:
 *                  type: array
 *                  items:
 *                    $ref: '#/components/schemas/Dish'
 */
export class FetchDishesController {
  async handle(request: Request, response: Response) {
    const fetchDishesQueryParamsSchema = z.object({
      query: z.string().optional(),
    })

    const { query } = fetchDishesQueryParamsSchema.parse(request.query)

    const fetchDishes = container.resolve(FetchDishesUseCase)

    const result = await fetchDishes.execute({ query })

    if (result.isLeft()) {
      throw new BadRequestError()
    }

    const { dishes } = result.value

    return response.status(200).json({
      dishes: dishes.map(HttpDishDetailsPresenter.toHTTP),
    })
  }
}
