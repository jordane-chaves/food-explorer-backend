import { NextFunction, Request, Response } from 'express'

import { UserRoles } from '@/@types/user-roles'

import { UnauthorizedError } from '../errors/unauthorized-error'

export function verifyUserAuthorization(rolesToVerify: UserRoles[]) {
  return (request: Request, response: Response, next: NextFunction) => {
    const { user } = request

    const isAuthorized = rolesToVerify.includes(user.role)

    if (!isAuthorized) {
      throw new UnauthorizedError()
    }

    return next()
  }
}
