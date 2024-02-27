import { HashComparer } from '@/domain/account/application/cryptography/hash-comparer'
import { HashGenerator } from '@/domain/account/application/cryptography/hash-generator'

export class FakeHasher implements HashComparer, HashGenerator {
  async comparer(plain: string, hash: string): Promise<boolean> {
    return plain.concat('-hash') === hash
  }

  async hash(plain: string): Promise<string> {
    return plain.concat('-hash')
  }
}
