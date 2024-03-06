import { container } from 'tsyringe'

import { AdminsRepository } from '@/domain/account/application/repositories/admins-repository'
import { CustomersRepository } from '@/domain/account/application/repositories/customers-repository'
import { UsersRepository } from '@/domain/account/application/repositories/users-repository'
import { CategoriesRepository } from '@/domain/dish/application/repositories/categories-repository'
import { DishImagesRepository } from '@/domain/dish/application/repositories/dish-images-repository'
import { DishIngredientsRepository } from '@/domain/dish/application/repositories/dish-ingredients-repository'
import { DishesRepository } from '@/domain/dish/application/repositories/dishes-repository'
import { ImagesRepository } from '@/domain/dish/application/repositories/images-repository'
import { IngredientsRepository } from '@/domain/dish/application/repositories/ingredients-repository'
import { KnexAdminsRepository } from '@/infra/database/knex/repositories/knex-admins-repository'
import { KnexCategoriesRepository } from '@/infra/database/knex/repositories/knex-categories-repository'
import { KnexCustomersRepository } from '@/infra/database/knex/repositories/knex-customers-repository'
import { KnexDishImagesRepository } from '@/infra/database/knex/repositories/knex-dish-images-repository'
import { KnexDishIngredientsRepository } from '@/infra/database/knex/repositories/knex-dish-ingredients-repository'
import { KnexDishesRepository } from '@/infra/database/knex/repositories/knex-dishes-repository'
import { KnexImagesRepository } from '@/infra/database/knex/repositories/knex-images-repository'
import { KnexIngredientsRepository } from '@/infra/database/knex/repositories/knex-ingredients-repository'
import { KnexUsersRepository } from '@/infra/database/knex/repositories/knex-users-repository'

container.registerSingleton<AdminsRepository>(
  'AdminsRepository',
  KnexAdminsRepository,
)

container.registerSingleton<CustomersRepository>(
  'CustomersRepository',
  KnexCustomersRepository,
)

container.registerSingleton<CategoriesRepository>(
  'CategoriesRepository',
  KnexCategoriesRepository,
)

container.registerSingleton<DishesRepository>(
  'DishesRepository',
  KnexDishesRepository,
)

container.registerSingleton<ImagesRepository>(
  'ImagesRepository',
  KnexImagesRepository,
)

container.registerSingleton<IngredientsRepository>(
  'IngredientsRepository',
  KnexIngredientsRepository,
)

container.registerSingleton<DishIngredientsRepository>(
  'DishIngredientsRepository',
  KnexDishIngredientsRepository,
)

container.registerSingleton<DishImagesRepository>(
  'DishImagesRepository',
  KnexDishImagesRepository,
)

container.registerSingleton<UsersRepository>(
  'UsersRepository',
  KnexUsersRepository,
)
