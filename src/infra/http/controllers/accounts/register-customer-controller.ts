import { Request, Response } from 'express'
import { container } from 'tsyringe'
import { z } from 'zod'

import { UserAlreadyExistsError } from '@/domain/account/application/use-cases/errors/user-already-exists-error'
import { RegisterCustomerUseCase } from '@/domain/account/application/use-cases/register-customer'

import { BadRequestError } from '../../errors/bad-request-error'
import { ConflictError } from '../../errors/conflict-error'

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
