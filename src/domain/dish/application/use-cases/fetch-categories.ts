import { inject, injectable } from 'tsyringe'

import { Either, right } from '@/core/either'

import { Category } from '../../enterprise/entities/category'
import { CategoriesRepository } from '../repositories/categories-repository'

type FetchCategoriesUseCaseResponse = Either<
  null,
  {
    categories: Category[]
  }
>

@injectable()
export class FetchCategoriesUseCase {
  constructor(
    @inject('CategoriesRepository')
    private categoriesRepository: CategoriesRepository,
  ) {}

  async execute(): Promise<FetchCategoriesUseCaseResponse> {
    const categories = await this.categoriesRepository.findMany()

    return right({
      categories,
    })
  }
}
