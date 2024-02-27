import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import {
  Ingredient,
  IngredientProps,
} from '@/domain/dish/enterprise/entities/ingredient'
import { faker } from '@faker-js/faker'

export function makeIngredient(
  override: Partial<IngredientProps> = {},
  id?: UniqueEntityID,
): Ingredient {
  return Ingredient.create(
    {
      name: faker.lorem.words(),
      ...override,
    },
    id,
  )
}
