import { Router } from 'express'

import { verifyJWT } from '../../middlewares/verify-jwt'
import { AuthenticateController } from './authenticate-controller'
import { LogoutController } from './logout-controller'
import { ProfileController } from './profile-controller'
import { RefreshTokenController } from './refresh-token-controller'
import { RegisterAdminController } from './register-admin-controller'
import { RegisterCustomerController } from './register-customer-controller'

export const accountsRoutes = Router()

const authenticateController = new AuthenticateController()
const registerAdminController = new RegisterAdminController()
const registerCustomerController = new RegisterCustomerController()
const profileController = new ProfileController()
const refreshTokenController = new RefreshTokenController()
const logoutController = new LogoutController()

accountsRoutes.post('/register/admin', registerAdminController.handle)
accountsRoutes.post('/register', registerCustomerController.handle)
accountsRoutes.get('/profile', verifyJWT, profileController.handle)

accountsRoutes.post('/sessions', authenticateController.handle)
accountsRoutes.patch('/token/refresh', refreshTokenController.handle)
accountsRoutes.post('/logout', logoutController.handle)
