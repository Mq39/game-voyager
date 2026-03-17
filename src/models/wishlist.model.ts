export interface WishlistItem {
    id: number
    gameId: number
    title: string
    image: string | null
}

export interface AddToWishlistPayload {
    id: number
    title: string
    image: string
}