import { FakeEncrypter } from 'test/cryptography/fake-encrypter'

import { RefreshTokenUseCase } from './refresh-token'

let fakeEncrypter: FakeEncrypter

let sut: RefreshTokenUseCase

describe('Refresh Token', () => {
  beforeEach(() => {
    fakeEncrypter = new FakeEncrypter()

    sut = new RefreshTokenUseCase(fakeEncrypter, fakeEncrypter)
  })

  it('should refresh token', async () => {
    const decrypterSpy = vi.spyOn(fakeEncrypter, 'decrypt')
    const encrypterSpy = vi.spyOn(fakeEncrypter, 'encrypt')

    const userId = 'some-user-id'
    const token = await fakeEncrypter.encrypt({ sub: userId })

    const result = await sut.execute({ token })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      accessToken: expect.any(String),
      refreshToken: expect.any(String),
    })

    if (result.isRight()) {
      expect(result.value?.accessToken).not.toEqual(result.value?.refreshToken)
    }

    expect(decrypterSpy).toHaveBeenCalledWith(
      JSON.stringify({
        sub: userId,
      }),
    )

    expect(encrypterSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        sub: userId,
      }),
    )
  })
})
