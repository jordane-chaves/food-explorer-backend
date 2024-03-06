import { CategoriesRepository } from '@/domain/dish/application/repositories/categories-repository'
import { Category } from '@/domain/dish/enterprise/entities/category'

import { knex } from '../knex'
import { KnexCategoryMapper } from '../mappers/knex-category-mapper'

export class KnexCategoriesRepository implements CategoriesRepository {
  async findByName(name: string): Promise<Category | null> {
    const category = await knex('categories').where('name', name).first()

    if (!category) {
      return null
    }

    return KnexCategoryMapper.toDomain(category)
  }

  async findMany(): Promise<Category[]> {
    const categories = await knex('categories')

    return categories.map(KnexCategoryMapper.toDomain)
  }

  async create(category: Category): Promise<void> {
    const data = KnexCategoryMapper.toKnex(category)

    await knex('categories').insert(data)
  }
}
