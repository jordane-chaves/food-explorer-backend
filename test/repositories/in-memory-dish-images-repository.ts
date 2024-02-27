import { DishImagesRepository } from '@/domain/dish/application/repositories/dish-images-repository'
import { DishImage } from '@/domain/dish/enterprise/entities/dish-image'

export class InMemoryDishImagesRepository implements DishImagesRepository {
  public items: DishImage[] = []

  async findByDishId(dishId: string): Promise<DishImage | null> {
    const dishImage = this.items.find(
      (item) => item.dishId.toString() === dishId,
    )

    if (!dishImage) {
      return null
    }

    return dishImage
  }

  async deleteByDishId(dishId: string): Promise<void> {
    const itemIndex = this.items.findIndex(
      (item) => item.dishId.toString() === dishId,
    )

    if (itemIndex >= 0) {
      this.items.splice(itemIndex, 1)
    }
  }

  async create(image: DishImage): Promise<void> {
    this.items.push(image)
  }

  async save(image: DishImage): Promise<void> {
    const itemIndex = this.items.findIndex((item) =>
      item.dishId.equals(image.dishId),
    )

    if (itemIndex >= 0) {
      this.items[itemIndex] = image
    }
  }
}
