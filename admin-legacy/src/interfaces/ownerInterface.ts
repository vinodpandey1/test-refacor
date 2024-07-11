export interface OwnerService {
  Owner: OwnerI[]
  totalElements: number
  totalPages: number
  page: number
  size: number
  sort: string[]
}

export interface OwnerI {
  id: number
  email: string
  location: string
  name: string
  phoneNumber: string
}
