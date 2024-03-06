import { Router } from 'express'
import multer from 'multer'

import { verifyJWT } from '../../middlewares/verify-jwt'
import { verifyUserAuthorization } from '../../middlewares/verify-user-authorization'
import { CreateDishController } from './create-dish-controller'
import { DeleteDishController } from './delete-dish-controller'
import { EditDishController } from './edit-dish-controller'
import { FetchDishesController } from './fetch-dishes-controller'
import { GetDishController } from './get-dish-controller'
import { UploadImageController } from './upload-image-controller'

export const dishesRoutes = Router()

const upload = multer()

const createDishController = new CreateDishController()
const getDishController = new GetDishController()
const fetchDishesController = new FetchDishesController()
const deleteDishController = new DeleteDishController()
const uploadImageController = new UploadImageController()
const editDishController = new EditDishController()

dishesRoutes.use(verifyJWT)

dishesRoutes.get('/:dishId', getDishController.handle)
dishesRoutes.get('/', fetchDishesController.handle)

dishesRoutes.use(verifyUserAuthorization(['admin']))

dishesRoutes.post('/', createDishController.handle)
dishesRoutes.put('/:dishId', editDishController.handle)
dishesRoutes.delete('/:dishId', deleteDishController.handle)

dishesRoutes.post('/image', upload.single('file'), uploadImageController.handle)
