import { ImagesRepository } from '@/domain/dish/application/repositories/images-repository'
import { Image } from '@/domain/dish/enterprise/entities/image'

import { knex } from '../knex'
import { KnexImageMapper } from '../mappers/knex-image-mapper'

export class KnexImagesRepository implements ImagesRepository {
  async create(image: Image): Promise<void> {
    const data = KnexImageMapper.toKnex(image)

    await knex('images').insert(data)
  }
}
