import { DishDetails } from '@/domain/dish/enterprise/entities/value-objects/dish-details'
import { env } from '@/infra/env'

import { HttpIngredientPresenter } from './http-ingredient-presenter'

export class HttpDishDetailsPresenter {
  static toHTTP(dish: DishDetails) {
    const image_url = env.STORAGE_PUBLIC_URL.concat(`/${dish.imageUrl}`)
    const price = dish.priceInCents / 100

    return {
      id: dish.dishId.toString(),
      category_id: dish.categoryId.toString(),
      category: dish.category,
      name: dish.name,
      description: dish.description,
      price,
      image_url,
      ingredients: dish.ingredients.map(HttpIngredientPresenter.toHTTP),
      created_at: dish.createdAt,
      updated_at: dish.updatedAt,
    }
  }
}
