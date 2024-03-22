import { sign, verify } from 'jsonwebtoken'

import { Decrypter } from '@/domain/account/application/cryptography/decrypter'
import { Encrypter } from '@/domain/account/application/cryptography/encrypter'

import { env } from '../env'

export class JwtEncrypter implements Encrypter, Decrypter {
  async encrypt(payload: Record<string, unknown>): Promise<string> {
    return sign(payload, env.JWT_SECRET)
  }

  async decrypt(token: string): Promise<Record<string, unknown> | null> {
    try {
      const payload = verify(token, env.JWT_SECRET)
      return payload as Record<string, unknown>
    } catch (error) {
      return null
    }
  }
}
