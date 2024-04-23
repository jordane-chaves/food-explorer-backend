import storageConfig from '@/config/storage'
import { DishDetails } from '@/domain/dish/enterprise/entities/value-objects/dish-details'

import { HttpIngredientPresenter } from './http-ingredient-presenter'

export class HttpDishDetailsPresenter {
  static toHTTP(dish: DishDetails) {
    const image_url = storageConfig.publicUrl.concat(`/${dish.imageUrl}`)
    const price = dish.priceInCents / 100

    return {
      id: dish.dishId.toString(),
      category_id: dish.categoryId.toString(),
      category: dish.category,
      name: dish.name,
      description: dish.description,
      price,
      image_id: dish.imageId.toString(),
      image_url,
      ingredients: dish.ingredients.map(HttpIngredientPresenter.toHTTP),
      created_at: dish.createdAt,
      updated_at: dish.updatedAt,
    }
  }
}
