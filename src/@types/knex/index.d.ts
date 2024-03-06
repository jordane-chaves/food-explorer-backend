// eslint-disable-next-line
import { Knex } from 'knex'
import { KnexCategory } from './knex-category'
import { KnexDish } from './knex-dish'
import { KnexDishIngredient } from './knex-dish-ingredient'
import { KnexImage } from './knex-image'
import { KnexIngredient } from './knex-ingredient'
import { KnexUser } from './knex-user'

declare module 'knex/types/tables' {
  export interface Tables {
    categories: KnexCategory
    dishes: KnexDish
    dish_ingredients: KnexDishIngredient
    images: KnexImage
    ingredients: KnexIngredient
    users: KnexUser
  }
}
