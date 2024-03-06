import { KnexUser } from '@/@types/knex/knex-user'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { User } from '@/domain/account/enterprise/entities/user'

export class KnexUserMapper {
  static toDomain(raw: KnexUser): User {
    return User.create(
      {
        name: raw.name,
        email: raw.email,
        password: raw.password_hash,
        role: raw.role,
      },
      new UniqueEntityID(raw.id),
    )
  }
}
