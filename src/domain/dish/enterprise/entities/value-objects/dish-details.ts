import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { ValueObject } from '@/core/entities/value-object'

import { Ingredient } from '../ingredient'

interface DishDetailsProps {
  dishId: UniqueEntityID
  imageId: UniqueEntityID
  imageUrl: string
  categoryId: UniqueEntityID
  category: string
  name: string
  description: string
  priceInCents: number
  ingredients: Ingredient[]
  createdAt: Date
  updatedAt?: Date | null
}

export class DishDetails extends ValueObject<DishDetailsProps> {
  get dishId() {
    return this.props.dishId
  }

  get imageId() {
    return this.props.imageId
  }

  get imageUrl() {
    return this.props.imageUrl
  }

  get categoryId() {
    return this.props.categoryId
  }

  get category() {
    return this.props.category
  }

  get name() {
    return this.props.name
  }

  get description() {
    return this.props.description
  }

  get priceInCents() {
    return this.props.priceInCents
  }

  get ingredients() {
    return this.props.ingredients
  }

  get createdAt() {
    return this.props.createdAt
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  static create(props: DishDetailsProps) {
    return new DishDetails(props)
  }
}
