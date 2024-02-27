import { Admin } from '../../enterprise/entities/admin'

export interface AdminsRepository {
  findByEmail(email: string): Promise<Admin | null>
  create(admin: Admin): Promise<void>
}
