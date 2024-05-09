import { Request, Response } from 'express'
import { container } from 'tsyringe'
import { z } from 'zod'

import { UserAlreadyExistsError } from '@/domain/account/application/use-cases/errors/user-already-exists-error'
import { RegisterCustomerUseCase } from '@/domain/account/application/use-cases/register-customer'

import { BadRequestError } from '../../errors/bad-request-error'
import { ConflictError } from '../../errors/conflict-error'

/**
 * @openapi
 * /register:
 *  post:
 *    tags: ['Account']
 *    summary: Create customer
 *    description: Create customer account
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
 *              name: Customer
 *              email: customer@example.com
 *              password: any-password
 *    responses:
 *      201:
 *        description: Created
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
 *               message: User "customer@example.com" already exists.
 *               statusCode: 409
 */
export class RegisterCustomerController {
  async handle(request: Request, response: Response) {
    const registerCustomerBodySchema = z.object({
      name: z.string(),
      email: z.string().email(),
      password: z.string().min(6),
    })

    const { email, name, password } = registerCustomerBodySchema.parse(
      request.body,
    )

    const registerCustomer = container.resolve(RegisterCustomerUseCase)

    const result = await registerCustomer.execute({
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
