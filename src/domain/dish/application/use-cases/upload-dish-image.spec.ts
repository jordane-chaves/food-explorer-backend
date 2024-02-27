import { InMemoryImagesRepository } from 'test/repositories/in-memory-images-repository'
import { FakeUploader } from 'test/storage/fake-uploader'

import { InvalidImageTypeError } from './errors/invalid-image-type-error'
import { UploadDishImageUseCase } from './upload-dish-image'

let inMemoryImagesRepository: InMemoryImagesRepository

let fakeUploader: FakeUploader

let sut: UploadDishImageUseCase

describe('Upload Dish Image', () => {
  beforeEach(() => {
    inMemoryImagesRepository = new InMemoryImagesRepository()

    fakeUploader = new FakeUploader()

    sut = new UploadDishImageUseCase(inMemoryImagesRepository, fakeUploader)
  })

  it('should be able to upload an image', async () => {
    const result = await sut.execute({
      fileName: 'dish.png',
      fileType: 'image/png',
      body: Buffer.from(''),
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      image: inMemoryImagesRepository.items[0],
    })

    expect(fakeUploader.uploads).toHaveLength(1)
    expect(fakeUploader.uploads[0]).toEqual(
      expect.objectContaining({
        fileName: 'dish.png',
      }),
    )
  })

  it('should not be able to upload an image with invalid file type', async () => {
    const result = await sut.execute({
      fileName: 'dish.mp3',
      fileType: 'audio/mpeg',
      body: Buffer.from(''),
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(InvalidImageTypeError)
  })
})
