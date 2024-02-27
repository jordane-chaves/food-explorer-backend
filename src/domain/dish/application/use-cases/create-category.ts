import { Either, right } from '@/core/either'

import { Category } from '../../enterprise/entities/category'
import { CategoriesRepository } from '../repositories/categories-repository'

interface CreateCategoryUseCaseRequest {
  name: string
}

type CreateCategoryUseCaseResponse = Either<
  null,
  {
    category: Category
  }
>

export class CreateCategoryUseCase {
  constructor(private categoriesRepository: CategoriesRepository) {}

  async execute(
    request: CreateCategoryUseCaseRequest,
  ): Promise<CreateCategoryUseCaseResponse> {
    const { name } = request

    let category = await this.categoriesRepository.findByName(name)

    if (!category) {
      category = Category.create({
        name,
      })

      await this.categoriesRepository.create(category)
    }

    return right({
      category,
    })
  }
}
