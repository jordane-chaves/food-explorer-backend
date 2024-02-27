import { Ingredient } from '../../enterprise/entities/ingredient'

export interface IngredientsRepository {
  searchMany(query: string): Promise<Ingredient[]>
  createMany(ingredients: Ingredient[]): Promise<void>
  deleteMany(ingredients: Ingredient[]): Promise<void>
}
