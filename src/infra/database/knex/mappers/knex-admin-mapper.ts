import { KnexUser } from '@/@types/knex/knex-user'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Admin } from '@/domain/account/enterprise/entities/admin'

export class KnexAdminMapper {
  static toDomain(raw: KnexUser): Admin {
    return Admin.create(
      {
        name: raw.name,
        email: raw.email,
        password: raw.password_hash,
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toKnex(admin: Admin): KnexUser {
    return {
      id: admin.id.toString(),
      name: admin.name,
      email: admin.email,
      password_hash: admin.password,
      role: 'admin',
    }
  }
}
