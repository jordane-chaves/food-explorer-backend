import { NextFunction, Request, Response } from 'express'
import { verify } from 'jsonwebtoken'

import { UserRoles } from '@/@types/user-roles'
import { env } from '@/infra/env'

import { UnauthorizedError } from '../errors/unauthorized-error'

interface Payload {
  sub: string
  role: UserRoles
}

export async function verifyJWT(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  const authHeader = request.headers.authorization

  if (!authHeader) {
    throw new UnauthorizedError('Token missing')
  }

  const [, token] = authHeader.split(' ')

  try {
    const { sub: userId, role } = verify(token, env.JWT_SECRET) as Payload

    request.user = {
      id: userId,
      role,
    }

    return next()
  } catch (error) {
    throw new UnauthorizedError()
  }
}
