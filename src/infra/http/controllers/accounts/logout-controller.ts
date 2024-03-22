import { Request, Response } from 'express'

export class LogoutController {
  async handle(_: Request, response: Response) {
    return response
      .cookie('refreshToken', '', {
        path: '/',
        httpOnly: true,
        sameSite: true,
        secure: true,
        maxAge: 1000 * 2, // 2 seconds
      })
      .send()
  }
}
