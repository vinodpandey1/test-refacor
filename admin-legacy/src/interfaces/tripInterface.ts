export interface TripServices {
  trip: tripI[]
  totalElements: number
  totalPages: number
  page: number
  size: number
  sort: string[]
}

export interface tripI {
  id: number
  createdBy: null
  createdDate: null
  lastModifiedBy: null
  lastModifiedDate: null
  revision: null
  bookingNumber: string
  checkInDate: Date
  checkOutDate: Date
  elivaasRevenue: string
  gbv: string
  ownerCommission: string
  villaName: string
  customer: number
}
