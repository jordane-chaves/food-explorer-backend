import { Router } from 'express'

import { verifyJWT } from '../../middlewares/verify-jwt'
import { AuthenticateController } from './authenticate-controller'
import { ProfileController } from './profile-controller'
import { RegisterAdminController } from './register-admin-controller'
import { RegisterCustomerController } from './register-customer-controller'

export const accountsRoutes = Router()

const authenticateController = new AuthenticateController()
const registerAdminController = new RegisterAdminController()
const registerCustomerController = new RegisterCustomerController()
const profileController = new ProfileController()

accountsRoutes.post('/register/admin', registerAdminController.handle)
accountsRoutes.post('/register', registerCustomerController.handle)
accountsRoutes.post('/sessions', authenticateController.handle)
accountsRoutes.get('/profile', verifyJWT, profileController.handle)
