import { WatchedList } from '@/core/entities/watched-list'

import { DishIngredient } from './dish-ingredient'

export class DishIngredientList extends WatchedList<DishIngredient> {
  compareItems(a: DishIngredient, b: DishIngredient): boolean {
    return a.name.trim().toLowerCase() === b.name.trim().toLowerCase()
  }
}
