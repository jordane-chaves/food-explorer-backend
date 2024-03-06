import { inject, injectable } from 'tsyringe'

import { Either, left, right } from '@/core/either'

import { DishDetails } from '../../enterprise/entities/value-objects/dish-details'
import { DishesRepository } from '../repositories/dishes-repository'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

interface GetDishUseCaseRequest {
  dishId: string
}

type GetDishUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    dish: DishDetails
  }
>

@injectable()
export class GetDishUseCase {
  constructor(
    @inject('DishesRepository')
    private dishesRepository: DishesRepository,
  ) {}

  async execute(
    request: GetDishUseCaseRequest,
  ): Promise<GetDishUseCaseResponse> {
    const { dishId } = request

    const dish = await this.dishesRepository.findDetailsById(dishId)

    if (!dish) {
      return left(new ResourceNotFoundError())
    }

    return right({
      dish,
    })
  }
}
