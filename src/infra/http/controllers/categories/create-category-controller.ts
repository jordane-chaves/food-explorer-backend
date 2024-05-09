import { Request, Response } from 'express'
import { container } from 'tsyringe'
import { z } from 'zod'

import { CreateCategoryUseCase } from '@/domain/dish/application/use-cases/create-category'

import { BadRequestError } from '../../errors/bad-request-error'
import { HttpCategoryPresenter } from '../../presenters/http-category-presenter'

/**
 * @openapi
 * /categories:
 *  post:
 *    tags: ['Category']
 *    summary: Create category
 *    description: Create a new category.
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            required:
 *              name
 *            type: object
 *            properties:
 *              name:
 *                type: string
 *                minLength: 3
 *            example:
 *              name: Refeição
 *    responses:
 *      201:
 *        description: Category created
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                category:
 *                  $ref: '#/components/schemas/Category'
 */
export class CreateCategoryController {
  async handle(request: Request, response: Response) {
    const createCategoryBodySchema = z.object({
      name: z.string().min(3),
    })

    const { name } = createCategoryBodySchema.parse(request.body)

    const createCategory = container.resolve(CreateCategoryUseCase)

    const result = await createCategory.execute({ name })

    if (result.isLeft()) {
      throw new BadRequestError()
    }

    const { category } = result.value

    return response.status(201).json({
      category: HttpCategoryPresenter.toHTTP(category),
    })
  }
}
