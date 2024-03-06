import { inject, injectable } from 'tsyringe'

import { Either, right } from '@/core/either'

import { DishDetails } from '../../enterprise/entities/value-objects/dish-details'
import { DishesRepository } from '../repositories/dishes-repository'

interface FetchDishesUseCaseRequest {
  query?: string
}

type FetchDishesUseCaseResponse = Either<
  null,
  {
    dishes: DishDetails[]
  }
>

@injectable()
export class FetchDishesUseCase {
  constructor(
    @inject('DishesRepository')
    private dishesRepository: DishesRepository,
  ) {}

  async execute(
    request: FetchDishesUseCaseRequest,
  ): Promise<FetchDishesUseCaseResponse> {
    const { query } = request

    const dishes = await this.dishesRepository.searchManyWithDetails(query)

    return right({
      dishes,
    })
  }
}
