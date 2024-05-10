import { Request, Response } from 'express'

/**
 * @openapi
 * /logout:
 *  post:
 *    tags: ['Account']
 *    summary: Logout
 *    description: Sign out of the application
 *    security: []
 *    responses:
 *      200:
 *        description: Returns success response.
 */
export class LogoutController {
  async handle(_: Request, response: Response) {
    return response
      .cookie('refreshToken', '', {
        path: '/',
        httpOnly: true,
        sameSite: 'none',
        secure: true,
        maxAge: 1000 * 2, // 2 seconds
      })
      .send()
  }
}
