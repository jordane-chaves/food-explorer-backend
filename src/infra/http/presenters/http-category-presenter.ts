import { Category } from '@/domain/dish/enterprise/entities/category'

export class HttpCategoryPresenter {
  static toHTTP(category: Category) {
    return {
      id: category.id.toString(),
      name: category.name,
    }
  }
}
