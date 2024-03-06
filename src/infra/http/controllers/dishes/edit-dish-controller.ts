import { Request, Response } from 'express'
import { container } from 'tsyringe'
import { z } from 'zod'

import { EditDishUseCase } from '@/domain/dish/application/use-cases/edit-dish'
import { ResourceNotFoundError } from '@/domain/dish/application/use-cases/errors/resource-not-found-error'

import { BadRequestError } from '../../errors/bad-request-error'

export class EditDishController {
  async handle(request: Request, response: Response) {
    const editDishParamsSchema = z.object({
      dishId: z.string().uuid(),
    })

    const { dishId } = editDishParamsSchema.parse(request.params)

    const editDishBodySchema = z.object({
      categoryId: z.string().uuid(),
      imageId: z.string().uuid(),
      ingredients: z.string().array(),
      name: z.string(),
      description: z.string(),
      price: z.number(),
    })

    const { categoryId, imageId, description, ingredients, name, price } =
      editDishBodySchema.parse(request.body)

    const priceInCents = price * 100

    const editDish = container.resolve(EditDishUseCase)

    const result = await editDish.execute({
      dishId,
      categoryId,
      imageId,
      description,
      ingredients,
      name,
      priceInCents,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case ResourceNotFoundError:
          throw new BadRequestError(error.message)
        default:
          throw new BadRequestError()
      }
    }

    return response.status(204).send()
  }
}
