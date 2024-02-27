import { ImagesRepository } from '@/domain/dish/application/repositories/images-repository'
import { Image } from '@/domain/dish/enterprise/entities/image'

export class InMemoryImagesRepository implements ImagesRepository {
  public items: Image[] = []

  async create(image: Image): Promise<void> {
    this.items.push(image)
  }
}
