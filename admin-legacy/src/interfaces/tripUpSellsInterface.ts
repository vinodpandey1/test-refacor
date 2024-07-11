export interface TripUpSellsServices {
  tripUpSells: TripUpSellsI[]
  totalElements: number
  totalPages: number
  page: number
  size: number
  sort: string[]
}

export interface TripUpSellsI {
  name: string
  price: string
  trip: number
}
