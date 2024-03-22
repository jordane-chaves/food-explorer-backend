import { User } from '@/domain/account/enterprise/entities/user'

export class HttpUserPresenter {
  static toHTTP(user: User) {
    return {
      id: user.id.toString(),
      name: user.name.toString(),
      email: user.email,
      role: user.role,
    }
  }
}
