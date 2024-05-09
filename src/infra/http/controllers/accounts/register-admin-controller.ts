import { Request, Response } from 'express'
import { container } from 'tsyringe'
import { z } from 'zod'

import { UserAlreadyExistsError } from '@/domain/account/application/use-cases/errors/user-already-exists-error'
import { RegisterAdminUseCase } from '@/domain/account/application/use-cases/register-admin'

import { BadRequestError } from '../../errors/bad-request-error'
import { ConflictError } from '../../errors/conflict-error'

/**
 * @openapi
 * /register/admin:
 *  post:
 *    tags: ['Account']
 *    summary: Create admin
 *    description: Create an administrator account to manage the restaurant
 *    security: []
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            required:
 *              name
 *              email
 *              password
 *            type: object
 *            properties:
 *              name:
 *                type: string
 *              email:
 *                type: string
 *              password:
 *                type: string
 *                minLength: 6
 *            example:
 *              name: Admin
 *              email: admin@example.com
 *              password: any-password
 *    responses:
 *      201:
 *        description: Admin user created
 *      400:
 *        description: Bad request
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/ValidationError'
 *              example:
 *                message: Validation error
 *                fields:
 *                  name: ['Required']
 *                  email: ['Invalid email']
 *                statusCode: 400
 *      409:
 *        description: >
 *          Returns conflict response.<br>
 *          This response means that the user already exists.
 *        content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/GeneralError'
 *             example:
 *               message: User "admin@example.com" already exists.
 *               statusCode: 409
 */
export class RegisterAdminController {
  async handle(request: Request, response: Response) {
    const registerAdminBodySchema = z.object({
      name: z.string(),
      email: z.string().email(),
      password: z.string().min(6),
    })

    const { email, name, password } = registerAdminBodySchema.parse(
      request.body,
    )

    const registerAdmin = container.resolve(RegisterAdminUseCase)

    const result = await registerAdmin.execute({
      email,
      name,
      password,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case UserAlreadyExistsError:
          throw new ConflictError(error.message)
        default:
          throw new BadRequestError()
      }
    }

    return response.status(201).send()
  }
}
