import { inject, injectable } from 'tsyringe'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { DishImagesRepository } from '@/domain/dish/application/repositories/dish-images-repository'
import { Remover } from '@/domain/dish/application/storage/remover'
import { DishImage } from '@/domain/dish/enterprise/entities/dish-image'

import { knex } from '../knex'

@injectable()
export class KnexDishImagesRepository implements DishImagesRepository {
  constructor(
    @inject('Remover')
    private remover: Remover,
  ) {}

  async findByDishId(dishId: string): Promise<DishImage | null> {
    const dish = await knex('dishes').where('id', dishId).first()

    if (!dish) {
      throw new Error('Invalid Dish Image type.')
    }

    return DishImage.create({
      dishId: new UniqueEntityID(dishId),
      imageId: new UniqueEntityID(dish.image_id),
    })
  }

  async deleteByDishId(dishId: string): Promise<void> {
    const files = await knex('images')
      .where('dish_id', dishId)
      .delete()
      .returning('url')

    if (files.length > 0) {
      const { url: fileName } = files[0]

      await this.remover.remove(fileName)
    }
  }

  async create(image: DishImage): Promise<void> {
    await knex('images')
      .where('id', image.imageId.toString())
      .update('dish_id', image.dishId.toString())
  }

  async save(image: DishImage): Promise<void> {
    const files = await knex('images')
      .where('dish_id', image.dishId.toString())
      .andWhereNot('id', image.imageId.toString())
      .delete()
      .returning('url')

    if (files.length > 0) {
      const { url: fileName } = files[0]

      await this.remover.remove(fileName)
    }

    await knex('images')
      .where('id', image.imageId.toString())
      .update('dish_id', image.dishId.toString())
  }
}
