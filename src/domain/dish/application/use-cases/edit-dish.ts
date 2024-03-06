import { inject, injectable } from 'tsyringe'

import { Either, left, right } from '@/core/either'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

import { Dish } from '../../enterprise/entities/dish'
import { DishImage } from '../../enterprise/entities/dish-image'
import { DishIngredient } from '../../enterprise/entities/dish-ingredient'
import { DishIngredientList } from '../../enterprise/entities/dish-ingredient-list'
import { DishImagesRepository } from '../repositories/dish-images-repository'
import { DishIngredientsRepository } from '../repositories/dish-ingredients-repository'
import { DishesRepository } from '../repositories/dishes-repository'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

interface EditDishUseCaseRequest {
  dishId: string
  categoryId: string
  imageId: string
  ingredients: string[]
  name: string
  description: string
  priceInCents: number
}

type EditDishUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    dish: Dish
  }
>

@injectable()
export class EditDishUseCase {
  constructor(
    @inject('DishesRepository')
    private dishesRepository: DishesRepository,
    @inject('DishIngredientsRepository')
    private dishIngredientsRepository: DishIngredientsRepository,
    @inject('DishImagesRepository')
    private dishImagesRepository: DishImagesRepository,
  ) {}

  async execute(
    request: EditDishUseCaseRequest,
  ): Promise<EditDishUseCaseResponse> {
    const {
      dishId,
      categoryId,
      imageId,
      ingredients,
      description,
      name,
      priceInCents,
    } = request

    const dish = await this.dishesRepository.findById(dishId)

    if (!dish) {
      return left(new ResourceNotFoundError())
    }

    let dishImage = await this.dishImagesRepository.findByDishId(dishId)

    if (dishImage) {
      if (imageId !== dishImage.imageId.toString()) {
        dishImage = DishImage.create({
          dishId: dish.id,
          imageId: new UniqueEntityID(imageId),
        })
      }

      dish.image = dishImage
    }

    const currentDishIngredients =
      await this.dishIngredientsRepository.findManyByDishId(dishId)
    const dishIngredientList = new DishIngredientList(currentDishIngredients)

    const dishIngredients = ingredients.map((ingredient) => {
      return DishIngredient.create({
        dishId: dish.id,
        name: ingredient,
      })
    })

    dishIngredientList.update(dishIngredients)

    dish.ingredients = dishIngredientList
    dish.categoryId = new UniqueEntityID(categoryId)
    dish.name = name
    dish.description = description
    dish.priceInCents = priceInCents

    await this.dishesRepository.save(dish)

    return right({
      dish,
    })
  }
}
