import { KnexIngredient } from '@/@types/knex/knex-ingredient'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Ingredient } from '@/domain/dish/enterprise/entities/ingredient'

export class KnexIngredientMapper {
  static toDomain(raw: KnexIngredient): Ingredient {
    return Ingredient.create(
      {
        name: raw.name,
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toKnex(ingredient: Ingredient): KnexIngredient {
    return {
      id: ingredient.id.toString(),
      name: ingredient.name,
    }
  }
}
