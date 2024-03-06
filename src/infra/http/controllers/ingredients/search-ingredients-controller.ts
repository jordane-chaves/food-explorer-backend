import { Request, Response } from 'express'
import { container } from 'tsyringe'
import { z } from 'zod'

import { SearchIngredientsUseCase } from '@/domain/dish/application/use-cases/search-ingredients'

import { BadRequestError } from '../../errors/bad-request-error'
import { HttpIngredientPresenter } from '../../presenters/http-ingredient-presenter'

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
