import { FakeEncrypter } from 'test/cryptography/fake-encrypter'
import { FakeHasher } from 'test/cryptography/fake-hasher'
import { makeAdmin } from 'test/factories/make-admin'
import { InMemoryAdminsRepository } from 'test/repositories/in-memory-admins-repository'

import { AuthenticateAdminUseCase } from './authenticate-admin'

let inMemoryAdminsRepository: InMemoryAdminsRepository

let fakeHasher: FakeHasher
let fakeEncrypter: FakeEncrypter

let sut: AuthenticateAdminUseCase

describe('Authenticate Admin', () => {
  beforeEach(() => {
    inMemoryAdminsRepository = new InMemoryAdminsRepository()

    fakeHasher = new FakeHasher()
    fakeEncrypter = new FakeEncrypter()

    sut = new AuthenticateAdminUseCase(
      inMemoryAdminsRepository,
      fakeHasher,
      fakeEncrypter,
    )
  })

  it('should be able to authenticate an admin', async () => {
    const encrypterSpy = vi.spyOn(fakeEncrypter, 'encrypt')

    const admin = makeAdmin({
      email: 'johndoe@example.com',
      password: await fakeHasher.hash('123456'),
    })

    inMemoryAdminsRepository.items.push(admin)

    const result = await sut.execute({
      email: 'johndoe@example.com',
      password: '123456',
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      accessToken: expect.any(String),
    })

    expect(encrypterSpy).toHaveBeenCalledWith({
      sub: admin.id.toString(),
      role: 'admin',
    })
  })
})
