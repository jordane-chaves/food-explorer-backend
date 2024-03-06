import { Router } from 'express'

import { AuthenticateController } from './authenticate-controller'
import { RegisterAdminController } from './register-admin-controller'
import { RegisterCustomerController } from './register-customer-controller'

export const accountsRoutes = Router()

const authenticateController = new AuthenticateController()
const registerAdminController = new RegisterAdminController()
const registerCustomerController = new RegisterCustomerController()

accountsRoutes.post('/register/admin', registerAdminController.handle)
accountsRoutes.post('/register', registerCustomerController.handle)
accountsRoutes.post('/sessions', authenticateController.handle)
