import { container } from 'tsyringe'

import storageConfig from '@/config/storage'
import { Remover } from '@/domain/dish/application/storage/remover'
import { Uploader } from '@/domain/dish/application/storage/uploader'
import { LocalStorage } from '@/infra/storage/local-storage'
import { R2Storage } from '@/infra/storage/r2-storage'

const storages = {
  local: LocalStorage,
  r2: R2Storage,
}

const Storage = storages[storageConfig.driver]
const storageInstance = new Storage(storageConfig.config[storageConfig.driver])

container.registerInstance<Uploader>('Uploader', storageInstance)
container.registerInstance<Remover>('Remover', storageInstance)
