import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { DishProps, Dish } from '@/domain/dish/enterprise/entities/dish'
import { faker } from '@faker-js/faker'

export function makeDish(
  override: Partial<DishProps> = {},
  id?: UniqueEntityID,
): Dish {
  return Dish.create(
    {
      categoryId: new UniqueEntityID(),
      name: faker.lorem.words(),
      description: faker.lorem.sentences(),
      priceInCents: faker.number.int(),
      ...override,
    },
    id,
  )
}
