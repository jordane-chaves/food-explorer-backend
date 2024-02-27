import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Image, ImageProps } from '@/domain/dish/enterprise/entities/image'
import { faker } from '@faker-js/faker'

export function makeImage(
  override: Partial<ImageProps> = {},
  id?: UniqueEntityID,
): Image {
  return Image.create(
    {
      title: faker.lorem.word(),
      url: faker.internet.url(),
      ...override,
    },
    id,
  )
}
