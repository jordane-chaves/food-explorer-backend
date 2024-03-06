import { Router } from 'express'

import { verifyJWT } from '../../middlewares/verify-jwt'
import { verifyUserAuthorization } from '../../middlewares/verify-user-authorization'
import { CreateCategoryController } from './create-category-controller'
import { ListCategoriesControllers } from './list-categories-controller'

export const categoriesRoutes = Router()

const createCategoryController = new CreateCategoryController()
const listCategoriesController = new ListCategoriesControllers()

categoriesRoutes.use(verifyJWT)

categoriesRoutes.post(
  '/',
  verifyUserAuthorization(['admin']),
  createCategoryController.handle,
)

categoriesRoutes.get('/', listCategoriesController.handle)
