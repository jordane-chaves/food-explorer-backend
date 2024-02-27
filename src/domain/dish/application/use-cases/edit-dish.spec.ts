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

import { EditDishUseCase } from './edit-dish'

let inMemoryDishIngredientsRepository: InMemoryDishIngredientsRepository
let inMemoryDishesRepository: InMemoryDishesRepository
let inMemoryDishImagesRepository: InMemoryDishImagesRepository
let inMemoryIngredientsRepository: InMemoryIngredientsRepository
let inMemoryCategoriesRepository: InMemoryCategoriesRepository
let inMemoryImagesRepository: InMemoryImagesRepository

let sut: EditDishUseCase

describe('Edit Dish', () => {
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

    sut = new EditDishUseCase(
      inMemoryDishesRepository,
      inMemoryDishIngredientsRepository,
      inMemoryDishImagesRepository,
    )
  })

  it('should be able to edit a dish', async () => {
    const dish = makeDish(
      {
        categoryId: new UniqueEntityID('category-1'),
        name: 'Batata',
        description: 'Batata assada',
        priceInCents: 120,
      },
      new UniqueEntityID('dish-1'),
    )

    inMemoryDishesRepository.items.push(dish)

    inMemoryIngredientsRepository.items.push(
      makeIngredient({ name: 'batata' }),
      makeIngredient({ name: 'bacon' }),
    )

    inMemoryDishIngredientsRepository.items.push(
      makeDishIngredient({
        dishId: dish.id,
        name: 'batata',
      }),
      makeDishIngredient({
        dishId: dish.id,
        name: 'bacon',
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
      categoryId: 'category-2',
      imageId: 'image-2',
      ingredients: ['batata', 'mussarela'],
      name: 'Salada Ravanello',
      description:
        'Rabanetes, folhas verdes e molho agridoce salpicados com gergelim.',
      priceInCents: 1000,
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryDishesRepository.items[0]).toEqual(
      expect.objectContaining({
        categoryId: new UniqueEntityID('category-2'),
        name: 'Salada Ravanello',
        description:
          'Rabanetes, folhas verdes e molho agridoce salpicados com gergelim.',
        priceInCents: 1000,
      }),
    )

    expect(
      inMemoryDishesRepository.items[0].ingredients.currentItems,
    ).toHaveLength(2)

    expect(inMemoryDishesRepository.items[0].ingredients.currentItems).toEqual([
      expect.objectContaining({ name: 'batata' }),
      expect.objectContaining({ name: 'mussarela' }),
    ])

    expect(inMemoryDishImagesRepository.items).toHaveLength(1)
    expect(inMemoryDishImagesRepository.items[0]).toEqual(
      expect.objectContaining({ imageId: new UniqueEntityID('image-2') }),
    )
  })

  it('should sync new and removed ingredients when editing a dish', async () => {
    const dish = makeDish(
      {
        categoryId: new UniqueEntityID('category-1'),
        name: 'Batata',
        description: 'Batata assada',
        priceInCents: 120,
      },
      new UniqueEntityID('dish-1'),
    )

    inMemoryDishesRepository.items.push(dish)

    inMemoryIngredientsRepository.items.push(
      makeIngredient({ name: 'batata' }),
      makeIngredient({ name: 'bacon' }),
    )

    inMemoryDishIngredientsRepository.items.push(
      makeDishIngredient({
        dishId: dish.id,
        name: 'batata',
      }),
      makeDishIngredient({
        dishId: dish.id,
        name: 'bacon',
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
      categoryId: 'category-2',
      imageId: 'image-2',
      ingredients: ['batata', 'mussarela'],
      name: 'Salada Ravanello',
      description:
        'Rabanetes, folhas verdes e molho agridoce salpicados com gergelim.',
      priceInCents: 1000,
    })

    expect(result.isRight()).toBe(true)

    expect(inMemoryDishIngredientsRepository.items).toHaveLength(2)
    expect(inMemoryDishIngredientsRepository.items).toEqual([
      expect.objectContaining({ name: 'batata' }),
      expect.objectContaining({ name: 'mussarela' }),
    ])

    expect(inMemoryIngredientsRepository.items).toHaveLength(2)
    expect(inMemoryIngredientsRepository.items).toEqual([
      expect.objectContaining({ name: 'batata' }),
      expect.objectContaining({ name: 'mussarela' }),
    ])
  })

  it('should not delete ingredient if it associated with another dish', async () => {
    inMemoryIngredientsRepository.items.push(makeIngredient({ name: 'alface' }))

    const dish1 = makeDish()
    const dish2 = makeDish()

    inMemoryDishesRepository.items.push(dish1, dish2)

    inMemoryDishIngredientsRepository.items.push(
      makeDishIngredient({ dishId: dish1.id, name: 'alface' }),
      makeDishIngredient({ dishId: dish2.id, name: 'alface' }),
    )

    const result = await sut.execute({
      dishId: dish1.id.toString(),
      categoryId: 'category-2',
      imageId: 'image-2',
      ingredients: [],
      name: 'Salada Ravanello',
      description:
        'Rabanetes, folhas verdes e molho agridoce salpicados com gergelim.',
      priceInCents: 1000,
    })

    expect(result.isRight()).toBe(true)

    expect(inMemoryDishIngredientsRepository.items).toHaveLength(1)
    expect(inMemoryDishIngredientsRepository.items[0]).toEqual(
      expect.objectContaining({
        dishId: dish2.id,
        name: 'alface',
      }),
    )

    expect(inMemoryIngredientsRepository.items).toHaveLength(1)
  })
})
