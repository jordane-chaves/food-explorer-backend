import { InMemoryCategoriesRepository } from 'test/repositories/in-memory-categories-repository'
import { InMemoryDishImagesRepository } from 'test/repositories/in-memory-dish-images-repository'
import { InMemoryDishIngredientsRepository } from 'test/repositories/in-memory-dish-ingredients-repository'
import { InMemoryDishesRepository } from 'test/repositories/in-memory-dishes-repository'
import { InMemoryImagesRepository } from 'test/repositories/in-memory-images-repository'
import { InMemoryIngredientsRepository } from 'test/repositories/in-memory-ingredients-repository'

import { CreateDishUseCase } from './create-dish'

let inMemoryDishIngredientsRepository: InMemoryDishIngredientsRepository
let inMemoryDishesRepository: InMemoryDishesRepository
let inMemoryDishImagesRepository: InMemoryDishImagesRepository
let inMemoryIngredientsRepository: InMemoryIngredientsRepository
let inMemoryCategoriesRepository: InMemoryCategoriesRepository
let inMemoryImagesRepository: InMemoryImagesRepository

let sut: CreateDishUseCase

describe('Create Dish', () => {
  beforeEach(() => {
    inMemoryCategoriesRepository = new InMemoryCategoriesRepository()
    inMemoryImagesRepository = new InMemoryImagesRepository()
    inMemoryIngredientsRepository = new InMemoryIngredientsRepository()
    inMemoryDishImagesRepository = new InMemoryDishImagesRepository()

    inMemoryDishIngredientsRepository = new InMemoryDishIngredientsRepository(
      inMemoryIngredientsRepository,
    )

    inMemoryDishesRepository = new InMemoryDishesRepository(
      inMemoryDishIngredientsRepository,
      inMemoryDishImagesRepository,
      inMemoryImagesRepository,
      inMemoryCategoriesRepository,
      inMemoryIngredientsRepository,
    )

    sut = new CreateDishUseCase(inMemoryDishesRepository)
  })

  it('should be able to create a new dish', async () => {
    const result = await sut.execute({
      categoryId: 'category-1',
      imageId: 'image-1',
      name: 'Salada Ravanello',
      description:
        'Rabanetes, folhas verdes e molho agridoce salpicados com gergelim.',
      priceInCents: 1000,
      ingredients: ['alface', 'cebola'],
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      dish: inMemoryDishesRepository.items[0],
    })

    expect(inMemoryDishImagesRepository.items).toHaveLength(1)

    expect(
      inMemoryDishesRepository.items[0].ingredients.currentItems,
    ).toHaveLength(2)

    expect(inMemoryDishesRepository.items[0].ingredients.currentItems).toEqual([
      expect.objectContaining({ name: 'alface' }),
      expect.objectContaining({ name: 'cebola' }),
    ])
  })

  it('should persist ingredients when creating a new dish', async () => {
    const result = await sut.execute({
      categoryId: 'category-1',
      imageId: 'image-1',
      name: 'Salada Ravanello',
      description:
        'Rabanetes, folhas verdes e molho agridoce salpicados com gergelim.',
      priceInCents: 1000,
      ingredients: ['alface', 'cebola'],
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryDishIngredientsRepository.items).toHaveLength(2)
    expect(inMemoryDishIngredientsRepository.items).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ name: 'alface' }),
        expect.objectContaining({ name: 'cebola' }),
      ]),
    )
  })

  it('should not create the ingredient twice', async () => {
    const result = await sut.execute({
      categoryId: 'category-1',
      imageId: 'image-1',
      name: 'Salada Ravanello',
      description:
        'Rabanetes, folhas verdes e molho agridoce salpicados com gergelim.',
      priceInCents: 1000,
      ingredients: ['alface', 'alface'],
    })

    expect(result.isRight()).toBe(true)

    expect(
      inMemoryDishesRepository.items[0].ingredients.currentItems,
    ).toHaveLength(1)

    expect(inMemoryDishesRepository.items[0].ingredients.currentItems).toEqual([
      expect.objectContaining({ name: 'alface' }),
    ])

    expect(inMemoryDishIngredientsRepository.items).toHaveLength(1)
    expect(inMemoryDishIngredientsRepository.items).toEqual(
      expect.arrayContaining([expect.objectContaining({ name: 'alface' })]),
    )
  })
})
