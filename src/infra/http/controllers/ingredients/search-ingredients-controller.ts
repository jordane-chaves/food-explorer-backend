import { Request, Response } from 'express'
import { container } from 'tsyringe'
import { z } from 'zod'

import { SearchIngredientsUseCase } from '@/domain/dish/application/use-cases/search-ingredients'

import { BadRequestError } from '../../errors/bad-request-error'
import { HttpIngredientPresenter } from '../../presenters/http-ingredient-presenter'

/**
 * @openapi
 * /ingredients:
 *  get:
 *    tags: ['Ingredient']
 *    summary: Search ingredients
 *    description: Search many ingredients
 *    parameters:
 *      - query:
 *        name: query
 *        description: Search by name of the ingredient.
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
 *                ingredients:
 *                  type: array
 *                  items:
 *                    $ref: '#/components/schemas/Ingredient'
 */
export class SearchIngredientsController {
  async handle(request: Request, response: Response) {
    const searchIngredientsQueryParamsSchema = z.object({
      query: z.string(),
    })

    const { query } = searchIngredientsQueryParamsSchema.parse(request.query)

    const searchIngredients = container.resolve(SearchIngredientsUseCase)

    const result = await searchIngredients.execute({ query })

    if (result.isLeft()) {
      throw new BadRequestError()
    }

    const { ingredients } = result.value

    return response.status(200).json({
      ingredients: ingredients.map(HttpIngredientPresenter.toHTTP),
    })
  }
}
