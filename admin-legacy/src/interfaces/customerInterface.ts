export interface CustomerService {
  Customer: CustomerI[]
  totalElements: number
  totalPages: number
  page: number
  size: number
  sort: string[]
}

export interface CustomerI {
  id: number
  createdBy: null
  createdDate: null
  lastModifiedBy: null
  lastModifiedDate: null
  revision: null
  email: string
  name: string
  phoneNumber: string
}
