import { container } from 'tsyringe'

import { Decrypter } from '@/domain/account/application/cryptography/decrypter'
import { Encrypter } from '@/domain/account/application/cryptography/encrypter'
import { HashComparer } from '@/domain/account/application/cryptography/hash-comparer'
import { HashGenerator } from '@/domain/account/application/cryptography/hash-generator'
import { BcryptHasher } from '@/infra/cryptography/bcrypt-hasher'
import { JwtEncrypter } from '@/infra/cryptography/jwt-encrypter'

container.register<Decrypter>('Decrypter', JwtEncrypter)
container.register<Encrypter>('Encrypter', JwtEncrypter)
container.register<HashGenerator>('HashGenerator', BcryptHasher)
container.register<HashComparer>('HashComparer', BcryptHasher)
