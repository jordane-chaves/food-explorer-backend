import { Router } from 'express'

import { verifyJWT } from '../../middlewares/verify-jwt'
import { verifyUserAuthorization } from '../../middlewares/verify-user-authorization'
import { SearchIngredientsController } from './search-ingredients-controller'

export const ingredientsRoutes = Router()

const searchIngredientsController = new SearchIngredientsController()

ingredientsRoutes.use(verifyJWT)

ingredientsRoutes.get(
  '/',
  verifyUserAuthorization(['admin']),
  searchIngredientsController.handle,
)
