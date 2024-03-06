import { sign } from 'jsonwebtoken'

import { Encrypter } from '@/domain/account/application/cryptography/encrypter'

import { env } from '../env'

export class JwtEncrypter implements Encrypter {
  async encrypt(payload: Record<string, unknown>): Promise<string> {
    return sign(payload, env.JWT_SECRET)
  }
}
