import { KnexDish } from '@/@types/knex/knex-dish'
import { KnexIngredient } from '@/@types/knex/knex-ingredient'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { DishDetails } from '@/domain/dish/enterprise/entities/value-objects/dish-details'

import { KnexIngredientMapper } from './knex-ingredient-mapper'

export type KnexDishDetails = KnexDish & {
  category: string
  image_url: string
  ingredients: KnexIngredient[]
}

export class KnexDishDetailsMapper {
  static toDomain(raw: KnexDishDetails): DishDetails {
    const ingredients = raw.ingredients.map(KnexIngredientMapper.toDomain)

    return DishDetails.create({
      dishId: new UniqueEntityID(raw.id),
      categoryId: new UniqueEntityID(raw.category_id),
      category: raw.category,
      imageId: new UniqueEntityID(raw.image_id),
      imageUrl: raw.image_url,
      name: raw.name,
      description: raw.description,
      priceInCents: raw.price_in_cents,
      ingredients,
      createdAt: raw.created_at,
      updatedAt: raw.updated_at,
    })
  }
}
