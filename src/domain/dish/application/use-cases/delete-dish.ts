import { inject, injectable } from 'tsyringe'

import { Either, left, right } from '@/core/either'

import { DishesRepository } from '../repositories/dishes-repository'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

interface DeleteDishUseCaseRequest {
  dishId: string
}

type DeleteDishUseCaseResponse = Either<ResourceNotFoundError, null>

@injectable()
export class DeleteDishUseCase {
  constructor(
    @inject('DishesRepository')
    private dishesRepository: DishesRepository,
  ) {}

  async execute(
    request: DeleteDishUseCaseRequest,
  ): Promise<DeleteDishUseCaseResponse> {
    const { dishId } = request

    const dish = await this.dishesRepository.findById(dishId)

    if (!dish) {
      return left(new ResourceNotFoundError())
    }

    await this.dishesRepository.delete(dish)

    return right(null)
  }
}
