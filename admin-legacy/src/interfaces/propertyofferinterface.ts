export interface PropertyOfferService {
  propertyOffer: PropertyOfferI[]
  totalElements: number
  totalPages: number
  page: number
  size: number
  sort: string[]
}

export interface PropertyOfferI {
  id: number
  percentage: string
  type: number
  property: number
}
