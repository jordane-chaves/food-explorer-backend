import { UsersRepository } from '@/domain/account/application/repositories/users-repository'
import { User } from '@/domain/account/enterprise/entities/user'

import { knex } from '../knex'
import { KnexUserMapper } from '../mappers/knex-user-mapper'

export class KnexUsersRepository implements UsersRepository {
  async findByEmail(email: string): Promise<User | null> {
    const user = await knex('users')
      .where({
        email,
      })
      .first()

    if (!user) {
      return null
    }

    return KnexUserMapper.toDomain(user)
  }

  async findById(id: string): Promise<User | null> {
    const user = await knex('users')
      .where({
        id,
      })
      .first()

    if (!user) {
      return null
    }

    return KnexUserMapper.toDomain(user)
  }
}
