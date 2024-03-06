import { KnexUser } from '@/@types/knex/knex-user'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Customer } from '@/domain/account/enterprise/entities/customer'

export class KnexCustomerMapper {
  static toDomain(raw: KnexUser): Customer {
    return Customer.create(
      {
        name: raw.name,
        email: raw.email,
        password: raw.password_hash,
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toKnex(customer: Customer): KnexUser {
    return {
      id: customer.id.toString(),
      name: customer.name,
      email: customer.email,
      password_hash: customer.password,
      role: 'customer',
    }
  }
}
