import { KnexDishIngredient } from '@/@types/knex/knex-dish-ingredient'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { DishIngredient } from '@/domain/dish/enterprise/entities/dish-ingredient'
import { Ingredient } from '@/domain/dish/enterprise/entities/ingredient'

type KnexDishIngredientWithIngredient = KnexDishIngredient & {
  ingredient_id: string
  ingredient_name: string
}

export class KnexDishIngredientMapper {
  static toDomain(raw: KnexDishIngredientWithIngredient): DishIngredient {
    return DishIngredient.create(
      {
        dishId: new UniqueEntityID(raw.dish_id),
        name: raw.ingredient_name,
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toKnex(
    dishIngredient: DishIngredient,
    ingredient: Ingredient,
  ): KnexDishIngredient {
    return {
      id: dishIngredient.id.toString(),
      dish_id: dishIngredient.dishId.toString(),
      ingredient_id: ingredient.id.toString(),
    }
  }
}
