export interface PropertyService {
  property: PropertyI[]
  totalElements: number
  totalPages: number
  page: number
  size: number
  sort: string[]
}

export interface PropertyI {
  id: number
  createdBy: string
  createdDate: Date
  lastModifiedBy: string
  lastModifiedDate: Date
  revision: number
  address: string
  cancellationPolicy: string
  description: string
  googleMapsLocation: string
  name: string
}
