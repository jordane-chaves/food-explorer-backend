import { makeCategory } from 'test/factories/make-category'
import { InMemoryCategoriesRepository } from 'test/repositories/in-memory-categories-repository'

import { FetchCategoriesUseCase } from './fetch-categories'

let inMemoryCategoriesRepository: InMemoryCategoriesRepository

let sut: FetchCategoriesUseCase

describe('Fetch categories', () => {
  beforeEach(() => {
    inMemoryCategoriesRepository = new InMemoryCategoriesRepository()

    sut = new FetchCategoriesUseCase(inMemoryCategoriesRepository)
  })

  it('should be able to fetch all categories', async () => {
    inMemoryCategoriesRepository.items.push(
      makeCategory({ name: 'Refeições' }),
      makeCategory({ name: 'Sobremesas' }),
      makeCategory({ name: 'Bebidas' }),
    )

    const result = await sut.execute()

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      categories: [
        expect.objectContaining({ name: 'Refeições' }),
        expect.objectContaining({ name: 'Sobremesas' }),
        expect.objectContaining({ name: 'Bebidas' }),
      ],
    })
  })
})
