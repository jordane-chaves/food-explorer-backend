import { Request, Response } from 'express'
import { container } from 'tsyringe'

import { UploadDishImageUseCase } from '@/domain/dish/application/use-cases/upload-dish-image'

import { BadRequestError } from '../../errors/bad-request-error'

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
