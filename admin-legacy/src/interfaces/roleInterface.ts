export interface RoleService {
  roleGettingState: RoleI[]
  totalElements: number
  totalPages: number
  page: number
  size: number
  sort: string[]
}

export interface RoleI {
  id: number
  createdBy: null
  createdDate: null
  lastModifiedBy: null
  lastModifiedDate: null
  revision: null
  description: string
  name: string
}
