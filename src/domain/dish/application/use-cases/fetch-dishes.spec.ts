import { makeCategory } from 'test/factories/make-category'
import { makeDish } from 'test/factories/make-dish'
import { makeDishImage } from 'test/factories/make-dish-image'
import { makeDishIngredient } from 'test/factories/make-dish-ingredient'
import { makeImage } from 'test/factories/make-image'
import { makeIngredient } from 'test/factories/make-ingredient'
import { InMemoryCategoriesRepository } from 'test/repositories/in-memory-categories-repository'
import { InMemoryDishImagesRepository } from 'test/repositories/in-memory-dish-images-repository'
import { InMemoryDishIngredientsRepository } from 'test/repositories/in-memory-dish-ingredients-repository'
import { InMemoryDishesRepository } from 'test/repositories/in-memory-dishes-repository'
import { InMemoryImagesRepository } from 'test/repositories/in-memory-images-repository'
import { InMemoryIngredientsRepository } from 'test/repositories/in-memory-ingredients-repository'

import { FetchDishesUseCase } from './fetch-dishes'

let inMemoryDishIngredientsRepository: InMemoryDishIngredientsRepository
let inMemoryDishesRepository: InMemoryDishesRepository
let inMemoryDishImagesRepository: InMemoryDishImagesRepository
let inMemoryIngredientsRepository: InMemoryIngredientsRepository
let inMemoryCategoriesRepository: InMemoryCategoriesRepository
let inMemoryImagesRepository: InMemoryImagesRepository

let sut: FetchDishesUseCase

describe('Fetch Dishes', () => {
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

    sut = new FetchDishesUseCase(inMemoryDishesRepository)
  })

  it('should be able to fetch dishes', async () => {
    const category = makeCategory()
    inMemoryCategoriesRepository.items.push(category)

    const image1 = makeImage()
    const image2 = makeImage()
    const image3 = makeImage()

    inMemoryImagesRepository.items.push(image1, image2, image3)

    const dish1 = makeDish({
      name: 'Salada Ravanello',
      categoryId: category.id,
    })

    const dish2 = makeDish({ name: 'Prugna Pie', categoryId: category.id })

    const dish3 = makeDish({
      name: 'Suco de maracujá',
      categoryId: category.id,
    })

    inMemoryDishesRepository.items.push(dish1, dish2, dish3)

    inMemoryDishImagesRepository.items.push(
      makeDishImage({ dishId: dish1.id, imageId: image1.id }),
      makeDishImage({ dishId: dish2.id, imageId: image2.id }),
      makeDishImage({ dishId: dish3.id, imageId: image3.id }),
    )

    const result = await sut.execute({})

    expect(result.isRight()).toBe(true)
    expect(result.value?.dishes).toHaveLength(3)
    expect(result.value).toEqual({
      dishes: [
        expect.objectContaining({
          name: 'Salada Ravanello',
          category: category.name,
          imageUrl: image1.url,
        }),
        expect.objectContaining({
          name: 'Prugna Pie',
          category: category.name,
          imageUrl: image2.url,
        }),
        expect.objectContaining({
          name: 'Suco de maracujá',
          category: category.name,
          imageUrl: image3.url,
        }),
      ],
    })
  })

  it('should be able to fetch dishes by name', async () => {
    const category = makeCategory()
    inMemoryCategoriesRepository.items.push(category)

    const image1 = makeImage()
    const image2 = makeImage()
    const image3 = makeImage()

    inMemoryImagesRepository.items.push(image1, image2, image3)

    const dish1 = makeDish({
      name: 'Salada Ravanello',
      categoryId: category.id,
    })

    const dish2 = makeDish({ name: 'Suco de limão', categoryId: category.id })

    const dish3 = makeDish({
      name: 'Suco de maracujá',
      categoryId: category.id,
    })

    inMemoryDishesRepository.items.push(dish1, dish2, dish3)

    inMemoryDishImagesRepository.items.push(
      makeDishImage({ dishId: dish1.id, imageId: image1.id }),
      makeDishImage({ dishId: dish2.id, imageId: image2.id }),
      makeDishImage({ dishId: dish3.id, imageId: image3.id }),
    )

    const result = await sut.execute({ query: 'suco' })

    expect(result.isRight()).toBe(true)
    expect(result.value?.dishes).toHaveLength(2)
    expect(result.value).toEqual({
      dishes: [
        expect.objectContaining({ name: 'Suco de limão' }),
        expect.objectContaining({ name: 'Suco de maracujá' }),
      ],
    })
  })

  it('should be able to fetch dishes by ingredients', async () => {
    const category = makeCategory()
    inMemoryCategoriesRepository.items.push(category)

    const image1 = makeImage()
    const image2 = makeImage()
    const image3 = makeImage()

    inMemoryImagesRepository.items.push(image1, image2, image3)

    const dish1 = makeDish({
      name: 'Suco de maracujá',
      categoryId: category.id,
    })
    const dish2 = makeDish({
      name: 'Salada Ravanello',
      categoryId: category.id,
    })

    inMemoryDishesRepository.items.push(dish1, dish2)

    inMemoryDishImagesRepository.items.push(
      makeDishImage({ dishId: dish1.id, imageId: image1.id }),
      makeDishImage({ dishId: dish2.id, imageId: image2.id }),
    )

    inMemoryIngredientsRepository.items.push(
      makeIngredient({ name: 'água' }),
      makeIngredient({ name: 'alface' }),
    )

    inMemoryDishIngredientsRepository.items.push(
      makeDishIngredient({ dishId: dish1.id, name: 'água' }),
      makeDishIngredient({ dishId: dish2.id, name: 'alface' }),
    )

    const result = await sut.execute({ query: 'água' })

    expect(result.isRight()).toBe(true)
    expect(result.value?.dishes).toHaveLength(1)
    expect(result.value).toEqual({
      dishes: [expect.objectContaining({ name: 'Suco de maracujá' })],
    })
  })
})
