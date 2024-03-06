import { Request, Response } from 'express'
import { container } from 'tsyringe'

import { FetchCategoriesUseCase } from '@/domain/dish/application/use-cases/fetch-categories'

import { BadRequestError } from '../../errors/bad-request-error'
import { HttpCategoryPresenter } from '../../presenters/http-category-presenter'

export class ListCategoriesControllers {
  async handle(request: Request, response: Response) {
    const fetchCategories = container.resolve(FetchCategoriesUseCase)

    const result = await fetchCategories.execute()

    if (result.isLeft()) {
      throw new BadRequestError()
    }

    const { categories } = result.value

    return response.status(200).json({
      categories: categories.map(HttpCategoryPresenter.toHTTP),
    })
  }
}
