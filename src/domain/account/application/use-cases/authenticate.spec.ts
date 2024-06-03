import { FakeEncrypter } from 'test/cryptography/fake-encrypter'
import { FakeHasher } from 'test/cryptography/fake-hasher'
import { makeUser } from 'test/factories/make-user'
import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository'

import { AuthenticateUseCase } from './authenticate'

let inMemoryUsersRepository: InMemoryUsersRepository

let fakeHasher: FakeHasher
let fakeEncrypter: FakeEncrypter

let sut: AuthenticateUseCase

describe('Authenticate', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository()

    fakeHasher = new FakeHasher()
    fakeEncrypter = new FakeEncrypter()

    sut = new AuthenticateUseCase(
      inMemoryUsersRepository,
      fakeHasher,
      fakeEncrypter,
    )
  })

  it('should be able to authenticate', async () => {
    const encrypterSpy = vi.spyOn(fakeEncrypter, 'encrypt')

    const user = makeUser({
      email: 'johndoe@example.com',
      password: await fakeHasher.hash('123456'),
      role: 'customer',
    })

    inMemoryUsersRepository.items.push(user)

    const result = await sut.execute({
      email: 'johndoe@example.com',
      password: '123456',
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      accessToken: expect.any(String),
      refreshToken: expect.any(String),
    })

    expect(encrypterSpy).toHaveBeenCalledWith({
      sub: user.id.toString(),
      role: 'customer',
      exp: expect.any(Number),
    })
  })
})
