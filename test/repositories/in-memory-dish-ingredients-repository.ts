import { DishIngredientsRepository } from '@/domain/dish/application/repositories/dish-ingredients-repository'
import { DishIngredient } from '@/domain/dish/enterprise/entities/dish-ingredient'
import { Ingredient } from '@/domain/dish/enterprise/entities/ingredient'

import { InMemoryIngredientsRepository } from './in-memory-ingredients-repository'

export class InMemoryDishIngredientsRepository
  implements DishIngredientsRepository
{
  public items: DishIngredient[] = []

  constructor(private ingredientsRepository: InMemoryIngredientsRepository) {}

  async findManyByDishId(dishId: string): Promise<DishIngredient[]> {
    const dishIngredients = this.items.filter(
      (item) => item.dishId.toString() === dishId,
    )

    return dishIngredients
  }

  async deleteManyByDishId(dishId: string): Promise<void> {
    const removedDishIngredients = this.items.filter(
      (item) => item.dishId.toString() === dishId,
    )

    const dishIngredients = this.items.filter((item) => {
      return item.dishId.toString() !== dishId
    })

    this.items = dishIngredients

    const removedIngredients = removedDishIngredients
      .map((item) => {
        const ingredient = this.ingredientsRepository.items.find(
          (ingredient) => ingredient.name === item.name,
        )

        if (!ingredient) {
          throw new Error(`Ingredient "${item.name}" does not exist`)
        }

        return ingredient
      })
      .filter((ingredient) => {
        const hasDishIngredient = this.items.some(
          (item) => item.name === ingredient.name,
        )
        return !hasDishIngredient
      })

    await this.ingredientsRepository.deleteMany(removedIngredients)
  }

  async createMany(dishIngredients: DishIngredient[]): Promise<void> {
    this.items.push(...dishIngredients)

    const ingredients = dishIngredients.map((item) =>
      Ingredient.create({
        name: item.name,
      }),
    )

    await this.ingredientsRepository.createMany(ingredients)
  }

  async deleteMany(ingredients: DishIngredient[]): Promise<void> {
    const dishIngredients = this.items.filter(
      (item) => !ingredients.some((ingredient) => ingredient.equals(item)),
    )

    this.items = dishIngredients

    const removedIngredients = ingredients
      .map((item) => {
        const ingredient = this.ingredientsRepository.items.find(
          (ingredient) => ingredient.name === item.name,
        )

        if (!ingredient) {
          throw new Error(`Ingredient "${item.name}" does not exist`)
        }

        return ingredient
      })
      .filter((ingredient) => {
        const hasDishIngredient = this.items.some(
          (item) => item.name === ingredient.name,
        )
        return !hasDishIngredient
      })

    await this.ingredientsRepository.deleteMany(removedIngredients)
  }
}
