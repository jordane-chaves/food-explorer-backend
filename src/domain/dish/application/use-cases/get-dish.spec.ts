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

import { UniqueEntityID } from '@/core/entities/unique-entity-id'

import { GetDishUseCase } from './get-dish'

let inMemoryIngredientsRepository: InMemoryIngredientsRepository
let inMemoryDishIngredientsRepository: InMemoryDishIngredientsRepository
let inMemoryDishesRepository: InMemoryDishesRepository
let inMemoryDishImagesRepository: InMemoryDishImagesRepository
let inMemoryCategoriesRepository: InMemoryCategoriesRepository
let inMemoryImagesRepository: InMemoryImagesRepository

let sut: GetDishUseCase

describe('Get Dish', () => {
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

    sut = new GetDishUseCase(inMemoryDishesRepository)
  })

  it('should be able to get a dish', async () => {
    const category = makeCategory()
    inMemoryCategoriesRepository.items.push(category)

    const dish = makeDish(
      {
        categoryId: category.id,
        name: 'Salada Ravanello',
      },
      new UniqueEntityID('dish-1'),
    )

    inMemoryDishesRepository.items.push(dish)

    const image = makeImage()

    inMemoryImagesRepository.items.push(image)
    inMemoryDishImagesRepository.items.push(
      makeDishImage({
        dishId: dish.id,
        imageId: image.id,
      }),
    )

    const ingredient1 = makeIngredient({ name: 'alface' })
    const ingredient2 = makeIngredient({ name: 'pão naan' })

    inMemoryIngredientsRepository.items.push(ingredient1, ingredient2)
    inMemoryDishIngredientsRepository.items.push(
      makeDishIngredient({
        dishId: dish.id,
        name: ingredient1.name,
      }),
      makeDishIngredient({
        dishId: dish.id,
        name: ingredient2.name,
      }),
    )

    const result = await sut.execute({
      dishId: 'dish-1',
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      dish: expect.objectContaining({
        name: 'Salada Ravanello',
        category: category.name,
        imageUrl: image.url,
        ingredients: expect.arrayContaining([
          expect.objectContaining({ name: 'alface' }),
          expect.objectContaining({ name: 'pão naan' }),
        ]),
      }),
    })
  })
})
