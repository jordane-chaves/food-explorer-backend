import { makeUser } from 'test/factories/make-user'
import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository'

import { GetProfileUseCase } from './get-profile'

let inMemoryUsersRepository: InMemoryUsersRepository

let sut: GetProfileUseCase

describe('Get Profile', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository()

    sut = new GetProfileUseCase(inMemoryUsersRepository)
  })

  it('should be able to get a user profile', async () => {
    const user = makeUser()
    inMemoryUsersRepository.items.push(user)

    const result = await sut.execute({ userId: user.id.toString() })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      user: inMemoryUsersRepository.items[0],
    })
  })
})
