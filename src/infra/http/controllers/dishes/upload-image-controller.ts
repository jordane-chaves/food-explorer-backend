import { Request, Response } from 'express'
import { container } from 'tsyringe'

import { UploadDishImageUseCase } from '@/domain/dish/application/use-cases/upload-dish-image'

import { BadRequestError } from '../../errors/bad-request-error'

/**
 * @openapi
 * /dishes/image:
 *  post:
 *    tags: ['Dish']
 *    summary: Upload image
 *    description: Upload a single dish image
 *    requestBody:
 *      content:
 *        multipart/form-data:
 *          schema:
 *            properties:
 *              file:
 *                description: Only accept `png/jpeg`
 *                type: array
 *                items: {}
 *          encoding:
 *            file:
 *              contentType: image/png, image/jpeg
 *    responses:
 *      201:
 *        description: Returns success response.
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                imageId:
 *                  type: string
 *                  format: uuid
 *              example:
 *                imageId: 40bdd72b-da4f-4f58-bd7e-d9abaa4494d6
 *      400:
 *        description: Returns bad request response.
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/GeneralError'
 *              example:
 *                message: File type "audio/mpeg" is not valid.
 *                statusCode: 400
 */
export class UploadImageController {
  async handle(request: Request, response: Response) {
    const file = request.file

    if (!file) {
      throw new BadRequestError('Image is required.')
    }

    const uploadDishImage = container.resolve(UploadDishImageUseCase)

    const result = await uploadDishImage.execute({
      fileName: file.originalname,
      fileType: file.mimetype,
      body: file.buffer,
    })

    if (result.isLeft()) {
      const error = result.value

      throw new BadRequestError(error.message)
    }

    const { image } = result.value

    return response.status(201).json({
      imageId: image.id.toString(),
    })
  }
}
