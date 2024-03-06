import { Category } from '../../enterprise/entities/category'

export interface CategoriesRepository {
  findByName(name: string): Promise<Category | null>
  findMany(): Promise<Category[]>
  create(category: Category): Promise<void>
}
