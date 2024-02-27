import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import {
  DishIngredient,
  DishIngredientProps,
} from '@/domain/dish/enterprise/entities/dish-ingredient'
import { faker } from '@faker-js/faker'

export function makeDishIngredient(
  override: Partial<DishIngredientProps> = {},
  id?: UniqueEntityID,
): DishIngredient {
  return DishIngredient.create(
    {
      dishId: new UniqueEntityID(),
      name: faker.lorem.word(),
      ...override,
    },
    id,
  )
}
