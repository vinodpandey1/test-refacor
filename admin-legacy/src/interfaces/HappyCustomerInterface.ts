export interface reviewI {
  id: number
  description: string
  rating: number
  Customer: Customer
  Media: Media[]
  is_allowed_to_display: boolean
  Property: Property
}

export interface Customer {
  name: string
}

export interface Media {
  image_url: string
}

export interface Property {
  id: number
  name: string
}
