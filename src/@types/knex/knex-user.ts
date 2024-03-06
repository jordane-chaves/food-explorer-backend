import { UserRoles } from '../user-roles'

export interface KnexUser {
  id?: string
  name: string
  email: string
  password_hash: string
  role: UserRoles
}
