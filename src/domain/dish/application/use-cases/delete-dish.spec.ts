import { makeDish } from 'test/factories/make-dish'
import { makeDishImage } from 'test/factories/make-dish-image'
import { makeDishIngredient } from 'test/factories/make-dish-ingredient'
import { makeIngredient } from 'test/factories/make-ingredient'
import { InMemoryCategoriesRepository } from 'test/repositories/in-memory-categories-repository'
import { InMemoryDishImagesRepository } from 'test/repositories/in-memory-dish-images-repository'
import { InMemoryDishIngredientsRepository } from 'test/repositories/in-memory-dish-ingredients-repository'
import { InMemoryDishesRepository } from 'test/repositories/in-memory-dishes-repository'
import { InMemoryImagesRepository } from 'test/repositories/in-memory-images-repository'
import { InMemoryIngredientsRepository } from 'test/repositories/in-memory-ingredients-repository'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'

import { DeleteDishUseCase } from './delete-dish'

let inMemoryDishIngredientsRepository: InMemoryDishIngredientsRepository
let inMemoryDishesRepository: InMemoryDishesRepository
let inMemoryDishImagesRepository: InMemoryDishImagesRepository
let inMemoryIngredientsRepository: InMemoryIngredientsRepository
let inMemoryCategoriesRepository: InMemoryCategoriesRepository
let inMemoryImagesRepository: InMemoryImagesRepository

let sut: DeleteDishUseCase

describe('Delete Dish', () => {
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

    sut = new DeleteDishUseCase(inMemoryDishesRepository)
  })

  it('should be able to delete a dish', async () => {
    const dish = makeDish(
      {
        name: 'Salada Ravanello',
      },
      new UniqueEntityID('dish-1'),
    )

    inMemoryDishesRepository.items.push(dish)

    inMemoryIngredientsRepository.items.push(
      makeIngredient({
        name: 'alface',
      }),
    )

    inMemoryDishIngredientsRepository.items.push(
      makeDishIngredient({
        dishId: dish.id,
        name: 'alface',
      }),
    )

    inMemoryDishImagesRepository.items.push(
      makeDishImage({
        dishId: dish.id,
        imageId: new UniqueEntityID('image-1'),
      }),
    )

    const result = await sut.execute({
      dishId: 'dish-1',
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryDishesRepository.items).toHaveLength(0)
    expect(inMemoryDishImagesRepository.items).toHaveLength(0)
    expect(inMemoryDishIngredientsRepository.items).toHaveLength(0)
    expect(inMemoryIngredientsRepository.items).toHaveLength(0)
  })
})
