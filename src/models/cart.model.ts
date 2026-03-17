export interface CartItem {
    id: number
    gameId: number
    title: string
    image: string | null
    quantity: number
}

export interface AddToCartPayload {
    gameId: number
    title: string
    image: string | null
    quantity?: number
}