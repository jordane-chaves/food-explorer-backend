import { inject, injectable } from 'tsyringe'

import { Either, right } from '@/core/either'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

import { Dish } from '../../enterprise/entities/dish'
import { DishImage } from '../../enterprise/entities/dish-image'
import { DishIngredient } from '../../enterprise/entities/dish-ingredient'
import { DishesRepository } from '../repositories/dishes-repository'

interface CreateDishUseCaseRequest {
  categoryId: string
  imageId: string
  name: string
  description: string
  priceInCents: number
  ingredients: string[]
}

type CreateDishUseCaseResponse = Either<
  null,
  {
    dish: Dish
  }
>

@injectable()
export class CreateDishUseCase {
  constructor(
    @inject('DishesRepository')
    private dishesRepository: DishesRepository,
  ) {}

  async execute(
    request: CreateDishUseCaseRequest,
  ): Promise<CreateDishUseCaseResponse> {
    const {
      categoryId,
      imageId,
      description,
      name,
      priceInCents,
      ingredients,
    } = request

    const dish = Dish.create({
      categoryId: new UniqueEntityID(categoryId),
      name,
      description,
      priceInCents,
    })

    ingredients.forEach((ingredient) => {
      const dishIngredient = DishIngredient.create({
        dishId: dish.id,
        name: ingredient,
      })

      dish.ingredients.add(dishIngredient)
    })

    dish.image = DishImage.create({
      dishId: dish.id,
      imageId: new UniqueEntityID(imageId),
    })

    await this.dishesRepository.create(dish)

    return right({
      dish,
    })
  }
}
