import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import {
  CategoryProps,
  Category,
} from '@/domain/dish/enterprise/entities/category'
import { faker } from '@faker-js/faker'

export function makeCategory(
  override: Partial<CategoryProps> = {},
  id?: UniqueEntityID,
): Category {
  return Category.create(
    {
      name: faker.lorem.words(),
      ...override,
    },
    id,
  )
}
