import { DishesRepository } from '@/domain/dish/application/repositories/dishes-repository'
import { Dish } from '@/domain/dish/enterprise/entities/dish'
import { DishDetails } from '@/domain/dish/enterprise/entities/value-objects/dish-details'

import { InMemoryCategoriesRepository } from './in-memory-categories-repository'
import { InMemoryDishImagesRepository } from './in-memory-dish-images-repository'
import { InMemoryDishIngredientsRepository } from './in-memory-dish-ingredients-repository'
import { InMemoryImagesRepository } from './in-memory-images-repository'
import { InMemoryIngredientsRepository } from './in-memory-ingredients-repository'

export class InMemoryDishesRepository implements DishesRepository {
  public items: Dish[] = []

  constructor(
    private dishIngredientsRepository: InMemoryDishIngredientsRepository,
    private dishImagesRepository: InMemoryDishImagesRepository,
    private imagesRepository: InMemoryImagesRepository,
    private categoriesRepository: InMemoryCategoriesRepository,
    private ingredientsRepository: InMemoryIngredientsRepository,
  ) {}

  async findDetailsById(id: string): Promise<DishDetails | null> {
    const dish = this.items.find((item) => item.id.toString() === id)

    if (!dish) {
      return null
    }

    const category = this.categoriesRepository.items.find((item) =>
      item.id.equals(dish.categoryId),
    )

    if (!category) {
      throw new Error(
        `Category with ID "${dish.categoryId.toString()}" does not exist.`,
      )
    }

    const dishImage = await this.dishImagesRepository.findByDishId(
      dish.id.toString(),
    )

    if (!dishImage) {
      throw new Error('Dish image does not exist.')
    }

    const image = this.imagesRepository.items.find((item) =>
      item.id.equals(dishImage.imageId),
    )

    if (!image) {
      throw new Error(
        `Image with ID "${dish.image?.imageId.toString()}" does not exist.`,
      )
    }

    const dishIngredients = this.dishIngredientsRepository.items.filter(
      (dishIngredients) => dishIngredients.dishId.equals(dish.id),
    )

    const ingredients = dishIngredients.map((dishIngredient) => {
      const ingredient = this.ingredientsRepository.items.find((ingredient) => {
        return ingredient.name === dishIngredient.name
      })

      if (!ingredient) {
        throw new Error(`Ingredient "${dishIngredient.name}" does not exist.`)
      }

      return ingredient
    })

    return DishDetails.create({
      dishId: dish.id,
      name: dish.name,
      description: dish.description,
      priceInCents: dish.priceInCents,
      createdAt: dish.createdAt,
      updatedAt: dish.updatedAt,
      categoryId: dish.categoryId,
      imageId: image.id,
      imageUrl: image.url,
      category: category.name,
      ingredients,
    })
  }

  async findById(id: string): Promise<Dish | null> {
    const dish = this.items.find((item) => item.id.toString() === id)

    if (!dish) {
      return null
    }

    return dish
  }

  async searchManyWithDetails(
    query?: string | undefined,
  ): Promise<DishDetails[]> {
    const dishes = this.items
      .filter((item) => {
        if (!query) {
          return true
        }

        const dishIngredients = this.dishIngredientsRepository.items.filter(
          (dishIngredient) =>
            dishIngredient.name
              .trim()
              .toLowerCase()
              .includes(query.trim().toLowerCase()),
        )

        const ingredientsMatches = dishIngredients.some((dishIngredient) =>
          dishIngredient.dishId.equals(item.id),
        )

        const nameMatches = item.name
          .toLowerCase()
          .includes(query.toLowerCase())

        return nameMatches || ingredientsMatches
      })
      .map((dish) => {
        const category = this.categoriesRepository.items.find((item) =>
          item.id.equals(dish.categoryId),
        )

        if (!category) {
          throw new Error(
            `Category with ID "${dish.categoryId.toString()}" does not exist.`,
          )
        }

        const dishImage = this.dishImagesRepository.items.find((item) =>
          item.dishId.equals(dish.id),
        )

        if (!dishImage) {
          throw new Error('Dish image does not exist.')
        }

        const image = this.imagesRepository.items.find((item) =>
          item.id.equals(dishImage.imageId),
        )

        if (!image) {
          throw new Error(
            `Image with ID "${dish.image?.imageId.toString()}" does not exist.`,
          )
        }

        const dishIngredients = this.dishIngredientsRepository.items.filter(
          (dishIngredients) => dishIngredients.dishId.equals(dish.id),
        )

        const ingredients = dishIngredients.map((dishIngredient) => {
          const ingredient = this.ingredientsRepository.items.find(
            (ingredient) => {
              return ingredient.name === dishIngredient.name
            },
          )

          if (!ingredient) {
            throw new Error(
              `Ingredient "${dishIngredient.name}" does not exist.`,
            )
          }

          return ingredient
        })

        return DishDetails.create({
          dishId: dish.id,
          name: dish.name,
          description: dish.description,
          priceInCents: dish.priceInCents,
          createdAt: dish.createdAt,
          updatedAt: dish.updatedAt,
          categoryId: dish.categoryId,
          imageId: image.id,
          imageUrl: image.url,
          category: category.name,
          ingredients,
        })
      })

    return dishes
  }

  async save(dish: Dish): Promise<void> {
    const itemIndex = this.items.findIndex((item) => item.id.equals(dish.id))

    if (itemIndex >= 0) {
      this.items[itemIndex] = dish

      await this.dishIngredientsRepository.createMany(
        dish.ingredients.getNewItems(),
      )

      await this.dishIngredientsRepository.deleteMany(
        dish.ingredients.getRemovedItems(),
      )

      if (dish.image) {
        await this.dishImagesRepository.save(dish.image)
      }
    }
  }

  async create(dish: Dish): Promise<void> {
    this.items.push(dish)

    await this.dishIngredientsRepository.createMany(dish.ingredients.getItems())

    if (dish.image) {
      await this.dishImagesRepository.create(dish.image)
    }
  }

  async delete(dish: Dish): Promise<void> {
    const itemIndex = this.items.findIndex((item) => item.id.equals(dish.id))

    if (itemIndex >= 0) {
      this.items.splice(itemIndex, 1)

      await this.dishImagesRepository.deleteByDishId(dish.id.toString())
      await this.dishIngredientsRepository.deleteManyByDishId(
        dish.id.toString(),
      )
    }
  }
}
