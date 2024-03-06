import { randomUUID } from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'

import uploadConfig from '@/config/upload'
import { Remover } from '@/domain/dish/application/storage/remover'
import {
  UploadParams,
  Uploader,
} from '@/domain/dish/application/storage/uploader'

export class LocalStorage implements Uploader, Remover {
  async upload(params: UploadParams): Promise<{ url: string }> {
    const { fileName, body } = params

    const uploadId = randomUUID()
    const uniqueFileName = `${uploadId}-${fileName}`

    await fs.promises.writeFile(
      path.resolve(uploadConfig.tmpFolder, uniqueFileName),
      body,
    )

    return {
      url: uniqueFileName,
    }
  }

  async remove(fileName: string): Promise<void> {
    const filePath = path.resolve(uploadConfig.tmpFolder, fileName)

    try {
      await fs.promises.stat(filePath)
    } catch {
      return
    }

    await fs.promises.unlink(filePath)
  }
}
