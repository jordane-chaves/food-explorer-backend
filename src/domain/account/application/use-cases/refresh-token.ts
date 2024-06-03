import { inject, injectable } from 'tsyringe'

import authConfig from '@/config/auth'
import { Either, left, right } from '@/core/either'

import { Decrypter } from '../cryptography/decrypter'
import { Encrypter } from '../cryptography/encrypter'
import { InvalidTokenError } from './errors/invalid-token-error'

interface RefreshTokenUseCaseRequest {
  token: string
}

type RefreshTokenUseCaseResponse = Either<
  InvalidTokenError,
  {
    accessToken: string
    refreshToken: string
  }
>

@injectable()
export class RefreshTokenUseCase {
  constructor(
    @inject('Decrypter')
    private decrypter: Decrypter,
    @inject('Encrypter')
    private encrypter: Encrypter,
  ) {}

  async execute(
    request: RefreshTokenUseCaseRequest,
  ): Promise<RefreshTokenUseCaseResponse> {
    const { token } = request

    const payload = await this.decrypter.decrypt(token)

    if (!payload) {
      return left(new InvalidTokenError())
    }

    const expiresAccessTokenInSeconds =
      Math.floor(Date.now() / 1000) +
      authConfig.accessTokenExpiresInMilliseconds / 1000

    const accessToken = await this.encrypter.encrypt({
      ...payload,
      exp: expiresAccessTokenInSeconds,
    })

    const expiresRefreshTokenInSeconds =
      Math.floor(Date.now() / 1000) +
      authConfig.refreshTokenExpiresInMilliseconds / 1000

    const refreshToken = await this.encrypter.encrypt({
      ...payload,
      exp: expiresRefreshTokenInSeconds,
    })

    return right({
      accessToken,
      refreshToken,
    })
  }
}
