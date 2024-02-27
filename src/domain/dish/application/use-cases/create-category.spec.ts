import { makeCategory } from 'test/factories/make-category'
import { InMemoryCategoriesRepository } from 'test/repositories/in-memory-categories-repository'

import { CreateCategoryUseCase } from './create-category'

let inMemoryCategoriesRepository: InMemoryCategoriesRepository

let sut: CreateCategoryUseCase

describe('Create Category', () => {
  beforeEach(() => {
    inMemoryCategoriesRepository = new InMemoryCategoriesRepository()

    sut = new CreateCategoryUseCase(inMemoryCategoriesRepository)
  })

  it('should be able to create a new category', async () => {
    const result = await sut.execute({
      name: 'Refeições',
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      category: inMemoryCategoriesRepository.items[0],
    })
  })

  it('should return category if already exists', async () => {
    inMemoryCategoriesRepository.items.push(
      makeCategory({
        name: 'Refeições',
      }),
    )

    const result = await sut.execute({
      name: 'Refeições',
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryCategoriesRepository.items).toHaveLength(1)
    expect(result.value).toEqual({
      category: inMemoryCategoriesRepository.items[0],
    })
  })
})
