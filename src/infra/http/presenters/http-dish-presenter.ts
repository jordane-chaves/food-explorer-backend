import { Dish } from '@/domain/dish/enterprise/entities/dish'

export class HttpDishPresenter {
  static toHTTP(dish: Dish) {
    const price = dish.priceInCents / 100

    return {
      id: dish.id.toString(),
      categoryId: dish.categoryId.toString(),
      name: dish.name,
      description: dish.description,
      price,
      createdAt: dish.createdAt,
      updatedAt: dish.updatedAt,
    }
  }
}
