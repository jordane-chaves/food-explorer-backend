import { Request, Response } from 'express'
import { container } from 'tsyringe'
import { z } from 'zod'

import { DeleteDishUseCase } from '@/domain/dish/application/use-cases/delete-dish'

import { BadRequestError } from '../../errors/bad-request-error'

export class DeleteDishController {
  async handle(request: Request, response: Response) {
    const deleteDishParamsSchema = z.object({
      dishId: z.string().uuid(),
    })

    const { dishId } = deleteDishParamsSchema.parse(request.params)

    const deleteDish = container.resolve(DeleteDishUseCase)

    const result = await deleteDish.execute({
      dishId,
    })

    if (result.isLeft()) {
      throw new BadRequestError()
    }

    return response.status(204).send()
  }
}
