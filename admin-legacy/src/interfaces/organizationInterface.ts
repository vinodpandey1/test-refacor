export interface OrganizationService {
  organizationGettingState: OrganizationI[]
  totalElements: number
  totalPages: number
  page: number
  size: number
  sort: string[]
}

export interface OrganizationI {
  id: number
  createdBy: null
  createdDate: null
  lastModifiedBy: null
  lastModifiedDate: null
  name: string
}
