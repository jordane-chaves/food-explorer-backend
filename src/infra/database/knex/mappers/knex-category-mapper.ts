import { KnexCategory } from '@/@types/knex/knex-category'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Category } from '@/domain/dish/enterprise/entities/category'

export class KnexCategoryMapper {
  static toDomain(raw: KnexCategory): Category {
    return Category.create(
      {
        name: raw.name,
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toKnex(category: Category): KnexCategory {
    return {
      id: category.id.toString(),
      name: category.name,
    }
  }
}
