import { container } from 'tsyringe'

import { Remover } from '@/domain/dish/application/storage/remover'
import { Uploader } from '@/domain/dish/application/storage/uploader'
import { LocalStorage } from '@/infra/storage/local-storage'

container.register<Uploader>('Uploader', LocalStorage)
container.register<Remover>('Remover', LocalStorage)
