export interface Game {
    id: number
    title: string
    image: string
    price?: number
    oldPrice?: number
    badge?: string
    rank?: number
    rating?: number
    released?: string
}

export interface BrowseGamesParams {
    search?: string
    genre?: string
    platform?: string
    ordering?: string
    page?: number
    pageSize?: number
}

export interface BrowseGamesResponse {
    results: Game[]
}

export interface RandomGame {
    id: number
    title: string
}