import { Dish } from '../../enterprise/entities/dish'
import { DishDetails } from '../../enterprise/entities/value-objects/dish-details'

export interface DishesRepository {
  findDetailsById(id: string): Promise<DishDetails | null>
  findById(id: string): Promise<Dish | null>
  searchManyWithDetails(query?: string): Promise<DishDetails[]>
  save(dish: Dish): Promise<void>
  create(dish: Dish): Promise<void>
  delete(dish: Dish): Promise<void>
}
