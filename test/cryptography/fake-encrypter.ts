import { Decrypter } from '@/domain/account/application/cryptography/decrypter'
import { Encrypter } from '@/domain/account/application/cryptography/encrypter'

export class FakeEncrypter implements Encrypter, Decrypter {
  async encrypt(payload: Record<string, unknown>): Promise<string> {
    return JSON.stringify(payload)
  }

  async decrypt(payload: string): Promise<Record<string, unknown>> {
    return JSON.parse(payload)
  }
}
