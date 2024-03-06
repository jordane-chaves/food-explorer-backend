import { inject, injectable } from 'tsyringe'

import { Either, right } from '@/core/either'

import { Ingredient } from '../../enterprise/entities/ingredient'
import { IngredientsRepository } from '../repositories/ingredients-repository'

interface SearchIngredientsUseCaseRequest {
  query: string
}

type SearchIngredientsUseCaseResponse = Either<
  null,
  {
    ingredients: Ingredient[]
  }
>

@injectable()
export class SearchIngredientsUseCase {
  constructor(
    @inject('IngredientsRepository')
    private ingredientsRepository: IngredientsRepository,
  ) {}

  async execute(
    request: SearchIngredientsUseCaseRequest,
  ): Promise<SearchIngredientsUseCaseResponse> {
    const { query } = request

    const ingredients = await this.ingredientsRepository.searchMany(query)

    return right({
      ingredients,
    })
  }
}
