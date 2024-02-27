import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

export interface DishImageProps {
  dishId: UniqueEntityID
  imageId: UniqueEntityID
}

export class DishImage extends Entity<DishImageProps> {
  get dishId() {
    return this.props.dishId
  }

  get imageId() {
    return this.props.imageId
  }

  static create(props: DishImageProps, id?: UniqueEntityID) {
    const dishImage = new DishImage(props, id)

    return dishImage
  }
}
