import { Request, Response } from 'express'
import { container } from 'tsyringe'
import { z } from 'zod'

import { CreateDishUseCase } from '@/domain/dish/application/use-cases/create-dish'

import { BadRequestError } from '../../errors/bad-request-error'

export class CreateDishController {
  async handle(request: Request, response: Response) {
    const createDishBodySchema = z.object({
      categoryId: z.string().uuid(),
      imageId: z.string().uuid(),
      name: z.string(),
      description: z.string(),
      price: z.number().min(0),
      ingredients: z.string().array(),
    })

    const { categoryId, imageId, description, ingredients, name, price } =
      createDishBodySchema.parse(request.body)

    const priceInCents = price * 100

    const createDish = container.resolve(CreateDishUseCase)

    const result = await createDish.execute({
      categoryId,
      imageId,
      description,
      ingredients,
      name,
      priceInCents,
    })

    if (result.isLeft()) {
      throw new BadRequestError()
    }

    return response.status(201).send()
  }
}
