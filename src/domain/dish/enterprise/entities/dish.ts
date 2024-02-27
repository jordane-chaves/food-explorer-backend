import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'

import { DishImage } from './dish-image'
import { DishIngredientList } from './dish-ingredient-list'

export interface DishProps {
  categoryId: UniqueEntityID
  image?: DishImage | null
  ingredients: DishIngredientList
  name: string
  description: string
  priceInCents: number
  createdAt: Date
  updatedAt?: Date | null
}

export class Dish extends Entity<DishProps> {
  get categoryId() {
    return this.props.categoryId
  }

  set categoryId(categoryId: UniqueEntityID) {
    this.props.categoryId = categoryId
    this.touch()
  }

  get image() {
    return this.props.image
  }

  set image(image: DishImage | null | undefined) {
    this.props.image = image
    this.touch()
  }

  get ingredients() {
    return this.props.ingredients
  }

  set ingredients(ingredients: DishIngredientList) {
    this.props.ingredients = ingredients
    this.touch()
  }

  get name() {
    return this.props.name
  }

  set name(name: string) {
    this.props.name = name
    this.touch()
  }

  get description() {
    return this.props.description
  }

  set description(description: string) {
    this.props.description = description
    this.touch()
  }

  get priceInCents() {
    return this.props.priceInCents
  }

  set priceInCents(priceInCents: number) {
    this.props.priceInCents = priceInCents
    this.touch()
  }

  get createdAt() {
    return this.props.createdAt
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  private touch() {
    this.props.updatedAt = new Date()
  }

  static create(
    props: Optional<DishProps, 'ingredients' | 'createdAt'>,
    id?: UniqueEntityID,
  ) {
    const dish = new Dish(
      {
        ...props,
        ingredients: props.ingredients ?? new DishIngredientList(),
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    )

    return dish
  }
}
