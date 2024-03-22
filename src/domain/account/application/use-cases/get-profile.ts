import { inject, injectable } from 'tsyringe'

import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/domain/dish/application/use-cases/errors/resource-not-found-error'

import { User } from '../../enterprise/entities/user'
import { UsersRepository } from '../repositories/users-repository'

interface GetProfileUseCaseRequest {
  userId: string
}

type GetProfileUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    user: User
  }
>

@injectable()
export class GetProfileUseCase {
  constructor(
    @inject('UsersRepository')
    private usersRepository: UsersRepository,
  ) {}

  async execute(
    request: GetProfileUseCaseRequest,
  ): Promise<GetProfileUseCaseResponse> {
    const { userId } = request

    const user = await this.usersRepository.findById(userId)

    if (!user) {
      return left(new ResourceNotFoundError())
    }

    return right({
      user,
    })
  }
}
