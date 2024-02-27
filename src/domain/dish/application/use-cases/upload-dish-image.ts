import { Either, left, right } from '@/core/either'

import { Image } from '../../enterprise/entities/image'
import { ImagesRepository } from '../repositories/images-repository'
import { Uploader } from '../storage/uploader'
import { InvalidImageTypeError } from './errors/invalid-image-type-error'

interface UploadDishImageUseCaseRequest {
  fileName: string
  fileType: string
  body: Buffer
}

type UploadDishImageUseCaseResponse = Either<
  InvalidImageTypeError,
  {
    image: Image
  }
>

export class UploadDishImageUseCase {
  constructor(
    private imagesRepository: ImagesRepository,
    private uploader: Uploader,
  ) {}

  async execute(
    request: UploadDishImageUseCaseRequest,
  ): Promise<UploadDishImageUseCaseResponse> {
    const { fileName, fileType, body } = request

    const isValidFileType = /^image\/(?:jpeg|png)$/.test(fileType)

    if (!isValidFileType) {
      return left(new InvalidImageTypeError(fileType))
    }

    const { url } = await this.uploader.upload({
      fileName,
      fileType,
      body,
    })

    const image = Image.create({
      title: fileName,
      url,
    })

    await this.imagesRepository.create(image)

    return right({
      image,
    })
  }
}
