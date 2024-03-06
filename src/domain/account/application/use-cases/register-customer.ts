import { inject, injectable } from 'tsyringe'

import { Either, left, right } from '@/core/either'

import { Customer } from '../../enterprise/entities/customer'
import { HashGenerator } from '../cryptography/hash-generator'
import { CustomersRepository } from '../repositories/customers-repository'
import { UserAlreadyExistsError } from './errors/user-already-exists-error'

interface RegisterCustomerUseCaseRequest {
  name: string
  email: string
  password: string
}

type RegisterCustomerUseCaseResponse = Either<
  UserAlreadyExistsError,
  {
    customer: Customer
  }
>

@injectable()
export class RegisterCustomerUseCase {
  constructor(
    @inject('CustomersRepository')
    private customersRepository: CustomersRepository,
    @inject('HashGenerator')
    private hashGenerator: HashGenerator,
  ) {}

  async execute(
    request: RegisterCustomerUseCaseRequest,
  ): Promise<RegisterCustomerUseCaseResponse> {
    const { email, name, password } = request

    const customerWithSameEmail =
      await this.customersRepository.findByEmail(email)

    if (customerWithSameEmail) {
      return left(new UserAlreadyExistsError(email))
    }

    const hashedPassword = await this.hashGenerator.hash(password)

    const customer = Customer.create({
      email,
      name,
      password: hashedPassword,
    })

    await this.customersRepository.create(customer)

    return right({
      customer,
    })
  }
}
