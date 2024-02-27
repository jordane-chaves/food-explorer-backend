import { IngredientsRepository } from '@/domain/dish/application/repositories/ingredients-repository'
import { Ingredient } from '@/domain/dish/enterprise/entities/ingredient'

export class InMemoryIngredientsRepository implements IngredientsRepository {
  public items: Ingredient[] = []

  async searchMany(query: string): Promise<Ingredient[]> {
    const ingredients = this.items.filter((item) =>
      item.name.toLowerCase().includes(query.toLowerCase()),
    )

    return ingredients
  }

  async createMany(ingredients: Ingredient[]): Promise<void> {
    this.items.push(...ingredients)
  }

  async deleteMany(ingredients: Ingredient[]): Promise<void> {
    const items = this.items.filter(
      (item) =>
        !ingredients.some((ingredient) => ingredient.name === item.name),
    )

    this.items = items
  }
}
