import { DishImage } from '../../enterprise/entities/dish-image'

export interface DishImagesRepository {
  findByDishId(dishId: string): Promise<DishImage | null>
  deleteByDishId(dishId: string): Promise<void>
  create(image: DishImage): Promise<void>
  save(image: DishImage): Promise<void>
}
