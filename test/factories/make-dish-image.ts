import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import {
  DishImage,
  DishImageProps,
} from '@/domain/dish/enterprise/entities/dish-image'

export function makeDishImage(
  override: Partial<DishImageProps> = {},
  id?: UniqueEntityID,
): DishImage {
  return DishImage.create(
    {
      dishId: new UniqueEntityID(),
      imageId: new UniqueEntityID(),
      ...override,
    },
    id,
  )
}
