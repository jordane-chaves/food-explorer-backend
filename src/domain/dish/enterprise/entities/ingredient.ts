import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

export interface IngredientProps {
  name: string
}

export class Ingredient extends Entity<IngredientProps> {
  get name() {
    return this.props.name
  }

  static create(props: IngredientProps, id?: UniqueEntityID) {
    const ingredient = new Ingredient(props, id)

    return ingredient
  }
}
