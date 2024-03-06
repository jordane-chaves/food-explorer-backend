import { Router } from 'express'

import { accountsRoutes } from '../controllers/accounts/routes'
import { categoriesRoutes } from '../controllers/categories/routes'
import { dishesRoutes } from '../controllers/dishes/routes'
import { ingredientsRoutes } from '../controllers/ingredients/routes'

export const routes = Router()

routes.use(accountsRoutes)
routes.use('/categories', categoriesRoutes)
routes.use('/dishes', dishesRoutes)
routes.use('/ingredients', ingredientsRoutes)
