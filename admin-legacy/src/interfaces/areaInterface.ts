export interface AreaService {
    areasGettingState: AreaI[]
    totalElements: number
    totalPages: number
    page: number
    size: number
    sort: string[]
}

export interface AreaI {
    id: number
    createdBy: null
    createdDate: null
    lastModifiedBy: null
    lastModifiedDate: null
    name: string
}
