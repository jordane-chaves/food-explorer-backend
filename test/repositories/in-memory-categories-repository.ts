import { CategoriesRepository } from '@/domain/dish/application/repositories/categories-repository'
import { Category } from '@/domain/dish/enterprise/entities/category'

export class InMemoryCategoriesRepository implements CategoriesRepository {
  public items: Category[] = []

  async findByName(name: string): Promise<Category | null> {
    const category = this.items.find(
      (item) => item.name.toLowerCase() === name.toLowerCase(),
    )

    if (!category) {
      return null
    }

    return category
  }

  async findMany(): Promise<Category[]> {
    return this.items
  }

  async create(category: Category): Promise<void> {
    this.items.push(category)
  }
}
