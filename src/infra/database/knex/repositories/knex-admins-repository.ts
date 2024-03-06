import { AdminsRepository } from '@/domain/account/application/repositories/admins-repository'
import { Admin } from '@/domain/account/enterprise/entities/admin'

import { knex } from '../knex'
import { KnexAdminMapper } from '../mappers/knex-admin-mapper'

export class KnexAdminsRepository implements AdminsRepository {
  async findByEmail(email: string): Promise<Admin | null> {
    const admin = await knex('users')
      .where({
        email,
        role: 'admin',
      })
      .first()

    if (!admin) {
      return null
    }

    return KnexAdminMapper.toDomain(admin)
  }

  async create(admin: Admin): Promise<void> {
    const data = KnexAdminMapper.toKnex(admin)

    await knex('users').insert(data)
  }
}
