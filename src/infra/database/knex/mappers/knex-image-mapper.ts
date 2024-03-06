import { KnexImage } from '@/@types/knex/knex-image'
import { Image } from '@/domain/dish/enterprise/entities/image'

export class KnexImageMapper {
  static toKnex(image: Image): KnexImage {
    return {
      id: image.id.toString(),
      title: image.title,
      url: image.url,
    }
  }
}
