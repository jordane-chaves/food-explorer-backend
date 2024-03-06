import { IngredientsRepository } from '@/domain/dish/application/repositories/ingredients-repository'
import { Ingredient } from '@/domain/dish/enterprise/entities/ingredient'

import { knex } from '../knex'
import { KnexIngredientMapper } from '../mappers/knex-ingredient-mapper'

export class KnexIngredientsRepository implements IngredientsRepository {
  async searchMany(query: string): Promise<Ingredient[]> {
    const ingredients = await knex('ingredients').whereILike(
      'name',
      `%${query}%`,
    )

    return ingredients.map(KnexIngredientMapper.toDomain)
  }

  async createMany(ingredients: Ingredient[]): Promise<void> {
    const data = ingredients.map(KnexIngredientMapper.toKnex)

    await knex('ingredients').insert(data).onConflict('name').ignore()
  }

  async deleteMany(ingredients: Ingredient[]): Promise<void> {
    const ingredientNames = ingredients.map((ingredient) => ingredient.name)

    await knex('ingredients')
      .whereNotIn('id', knex('dish_ingredients').distinct('ingredient_id'))
      .whereIn('ingredients.name', ingredientNames)
      .delete()
  }
}
