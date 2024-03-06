import { inject, injectable } from 'tsyringe'

import { DishesRepository } from '@/domain/dish/application/repositories/dishes-repository'
import { Dish } from '@/domain/dish/enterprise/entities/dish'
import { DishDetails } from '@/domain/dish/enterprise/entities/value-objects/dish-details'

import { knex } from '../knex'
import {
  KnexDishDetails,
  KnexDishDetailsMapper,
} from '../mappers/knex-dish-details-mapper'
import { KnexDishMapper } from '../mappers/knex-dish-mapper'
import { KnexDishImagesRepository } from './knex-dish-images-repository'
import { KnexDishIngredientsRepository } from './knex-dish-ingredients-repository'

@injectable()
export class KnexDishesRepository implements DishesRepository {
  constructor(
    @inject('DishIngredientsRepository')
    private dishIngredientsRepository: KnexDishIngredientsRepository,
    @inject('DishImagesRepository')
    private dishImagesRepository: KnexDishImagesRepository,
  ) {}

  async findDetailsById(id: string): Promise<DishDetails | null> {
    const dish: KnexDishDetails = await knex
      .select(
        'dishes.*',
        'categories.name as category',
        'images.url as image_url',
        knex.raw(
          "COALESCE(JSON_AGG(ingredients.*) FILTER (WHERE ingredients.id IS NOT NULL), '[]') as ingredients",
        ),
      )
      .from<KnexDishDetails>('dishes')
      .innerJoin('categories', 'categories.id', 'dishes.category_id')
      .innerJoin('images', 'images.id', 'dishes.image_id')
      .leftJoin('dish_ingredients', 'dish_ingredients.dish_id', 'dishes.id')
      .leftJoin(
        'ingredients',
        'ingredients.id',
        'dish_ingredients.ingredient_id',
      )
      .groupBy('dishes.id', 'categories.name', 'images.url')
      .where('dishes.id', id)
      .first()

    if (!dish) {
      return null
    }

    return KnexDishDetailsMapper.toDomain(dish)
  }

  async findById(id: string): Promise<Dish | null> {
    const dish = await knex('dishes').where('id', id).first()

    if (!dish) {
      return null
    }

    return KnexDishMapper.toDomain(dish)
  }

  async searchManyWithDetails(
    query: string | undefined = '',
  ): Promise<DishDetails[]> {
    const dishesIdsRef = knex.ref('dishes.id')
    const ingredientsSubQuery = knex
      .select('*')
      .from('ingredients')
      .innerJoin(
        'dish_ingredients',
        'dish_ingredients.ingredient_id',
        'ingredients.id',
      )
      .where('dish_ingredients.dish_id', dishesIdsRef)
      .andWhereILike('ingredients.name', `%${query}%`)

    const dishes: KnexDishDetails[] = await knex
      .select(
        'dishes.*',
        'categories.name as category',
        'images.url as image_url',
        knex.raw(
          "COALESCE(JSON_AGG(ingredients.*) FILTER (WHERE ingredients.id IS NOT NULL), '[]') as ingredients",
        ),
      )
      .from<KnexDishDetails>('dishes')
      .whereILike('dishes.name', `%${query}%`)
      .orWhereExists(ingredientsSubQuery)
      .leftJoin('categories', 'categories.id', 'dishes.category_id')
      .leftJoin('images', 'images.id', 'dishes.image_id')
      .leftJoin('dish_ingredients', 'dish_ingredients.dish_id', 'dishes.id')
      .leftJoin(
        'ingredients',
        'ingredients.id',
        'dish_ingredients.ingredient_id',
      )
      .groupBy('dishes.id', 'categories.name', 'images.url')

    return dishes.map(KnexDishDetailsMapper.toDomain)
  }

  async save(dish: Dish): Promise<void> {
    const data = KnexDishMapper.toKnex(dish)

    await knex('dishes').where('id', data.id).update(data)

    await this.dishIngredientsRepository.createMany(
      dish.ingredients.getNewItems(),
    )

    await this.dishIngredientsRepository.deleteMany(
      dish.ingredients.getRemovedItems(),
    )

    if (dish.image) {
      await this.dishImagesRepository.save(dish.image)
    }
  }

  async create(dish: Dish): Promise<void> {
    const data = KnexDishMapper.toKnex(dish)

    await knex('dishes').insert(data)

    await this.dishIngredientsRepository.createMany(dish.ingredients.getItems())

    if (dish.image) {
      await this.dishImagesRepository.create(dish.image)
    }
  }

  async delete(dish: Dish): Promise<void> {
    await this.dishIngredientsRepository.deleteManyByDishId(dish.id.toString())
    await this.dishImagesRepository.deleteByDishId(dish.id.toString())

    await knex('dishes').where('id', dish.id.toString()).delete()
  }
}
