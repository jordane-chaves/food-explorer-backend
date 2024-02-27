import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

export interface DishIngredientProps {
  dishId: UniqueEntityID
  name: string
}

export class DishIngredient extends Entity<DishIngredientProps> {
  get dishId() {
    return this.props.dishId
  }

  get name() {
    return this.props.name
  }

  static create(props: DishIngredientProps, id?: UniqueEntityID) {
    const dishIngredient = new DishIngredient(props, id)

    return dishIngredient
  }
}
