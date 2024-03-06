import { inject, injectable } from 'tsyringe'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { ExcludesFalsy } from '@/core/types/excludes-falsy'
import { DishIngredientsRepository } from '@/domain/dish/application/repositories/dish-ingredients-repository'
import { DishIngredient } from '@/domain/dish/enterprise/entities/dish-ingredient'
import { Ingredient } from '@/domain/dish/enterprise/entities/ingredient'

import { knex } from '../knex'
import { KnexDishIngredientMapper } from '../mappers/knex-dish-ingredient-mapper'
import { KnexIngredientMapper } from '../mappers/knex-ingredient-mapper'
import { KnexIngredientsRepository } from './knex-ingredients-repository'

@injectable()
export class KnexDishIngredientsRepository
  implements DishIngredientsRepository
{
  constructor(
    @inject('IngredientsRepository')
    private ingredientsRepository: KnexIngredientsRepository,
  ) {}

  async findManyByDishId(dishId: string): Promise<DishIngredient[]> {
    const dishIngredients = await knex('dish_ingredients')
      .select(
        'dish_ingredients.*',
        'ingredients.id as ingredient_id',
        'ingredients.name as ingredient_name',
      )
      .where('dish_id', dishId)
      .join(
        'ingredients',
        'ingredients.id',
        '=',
        'dish_ingredients.ingredient_id',
      )

    return dishIngredients.map(KnexDishIngredientMapper.toDomain)
  }

  async deleteManyByDishId(dishId: string): Promise<void> {
    const result = await knex('dish_ingredients')
      .where('dish_id', dishId)
      .delete()
      .returning('ingredient_id')

    const ingredientsIds = result.map((raw) => raw.ingredient_id)
    const rawIngredients = await knex('ingredients').whereIn(
      'id',
      ingredientsIds,
    )

    const ingredients = rawIngredients.map(KnexIngredientMapper.toDomain)

    await this.ingredientsRepository.deleteMany(ingredients)
  }

  async deleteMany(dishIngredients: DishIngredient[]): Promise<void> {
    const dishIngredientsIds = dishIngredients.map((item) => item.id.toString())

    await knex('dish_ingredients').whereIn('id', dishIngredientsIds).delete()

    const ingredientsNames = dishIngredients.map((item) => item.name)
    const knexIngredients = await knex('ingredients').whereIn(
      'name',
      ingredientsNames,
    )

    const ingredients = knexIngredients.map(KnexIngredientMapper.toDomain)

    await this.ingredientsRepository.deleteMany(ingredients)
  }

  async createMany(dishIngredients: DishIngredient[]): Promise<void> {
    const newIngredients = dishIngredients.map((dishIngredient) => {
      return Ingredient.create({
        name: dishIngredient.name,
      })
    })

    if (newIngredients.length === 0) {
      return
    }

    await this.ingredientsRepository.createMany(newIngredients)

    const ingredientsNames = dishIngredients.map((item) => item.name)
    const rawIngredients = await knex('ingredients').whereIn(
      'name',
      ingredientsNames,
    )

    const ingredients = rawIngredients.map((raw) => {
      return Ingredient.create(
        {
          name: raw.name,
        },
        new UniqueEntityID(raw.id),
      )
    })

    const data = dishIngredients
      .map((dishIngredient) => {
        const ingredient = ingredients.find(
          (item) => item.name === dishIngredient.name,
        )

        if (!ingredient) {
          return null
        }

        return KnexDishIngredientMapper.toKnex(dishIngredient, ingredient)
      })
      .filter(Boolean as unknown as ExcludesFalsy)

    await knex('dish_ingredients').insert(data)
  }
}
