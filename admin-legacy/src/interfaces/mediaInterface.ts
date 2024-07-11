export interface mediaServices {
  media: MediaI[]
  totalElements: number
  totalPages: number
  page: number
  size: number
  sort: string[]
}

export interface MediaI {
  id: number
  zcreatedBy: null
  zcreatedDate: null
  zlastModifiedBy: null
  zlastModifiedDate: null
  revision: number
  type: number
  url: string
  property: number
}
