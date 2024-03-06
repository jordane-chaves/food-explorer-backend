import { Ingredient } from '@/domain/dish/enterprise/entities/ingredient'

export class HttpIngredientPresenter {
  static toHTTP(ingredient: Ingredient) {
    return {
      id: ingredient.id.toString(),
      name: ingredient.name,
    }
  }
}
