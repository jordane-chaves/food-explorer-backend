import { User } from '../../enterprise/entities/user'

export interface UsersRepository {
  findByEmail(email: string): Promise<User | null>
}
