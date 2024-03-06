import { inject, injectable } from 'tsyringe'

import { Either, left, right } from '@/core/either'

import { Admin } from '../../enterprise/entities/admin'
import { HashGenerator } from '../cryptography/hash-generator'
import { AdminsRepository } from '../repositories/admins-repository'
import { UserAlreadyExistsError } from './errors/user-already-exists-error'

interface RegisterAdminUseCaseRequest {
  name: string
  email: string
  password: string
}

type RegisterAdminUseCaseResponse = Either<
  UserAlreadyExistsError,
  {
    admin: Admin
  }
>

@injectable()
export class RegisterAdminUseCase {
  constructor(
    @inject('AdminsRepository')
    private adminsRepository: AdminsRepository,
    @inject('HashGenerator')
    private hashGenerator: HashGenerator,
  ) {}

  async execute(
    request: RegisterAdminUseCaseRequest,
  ): Promise<RegisterAdminUseCaseResponse> {
    const { email, name, password } = request

    const adminWithSameEmail = await this.adminsRepository.findByEmail(email)

    if (adminWithSameEmail) {
      return left(new UserAlreadyExistsError(email))
    }

    const hashedPassword = await this.hashGenerator.hash(password)

    const admin = Admin.create({
      email,
      name,
      password: hashedPassword,
    })

    await this.adminsRepository.create(admin)

    return right({
      admin,
    })
  }
}
