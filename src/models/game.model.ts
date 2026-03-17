export interface Game {
    id: number
    title: string
    image: string
    price?: number | undefined
    oldPrice?: number
    badge?: string
    rank?: number
    rating?: number
    released?: string
}