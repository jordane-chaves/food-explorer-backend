import { CustomersRepository } from '@/domain/account/application/repositories/customers-repository'
import { Customer } from '@/domain/account/enterprise/entities/customer'

import { knex } from '../knex'
import { KnexCustomerMapper } from '../mappers/knex-customer-mapper'

export class KnexCustomersRepository implements CustomersRepository {
  async findByEmail(email: string): Promise<Customer | null> {
    const customer = await knex('users')
      .where({
        email,
        role: 'customer',
      })
      .first()

    if (!customer) {
      return null
    }

    return KnexCustomerMapper.toDomain(customer)
  }

  async create(customer: Customer): Promise<void> {
    const data = KnexCustomerMapper.toKnex(customer)

    await knex('users').insert(data)
  }
}
