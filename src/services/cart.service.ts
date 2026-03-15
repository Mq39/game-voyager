import { api } from "./api"

export type CartItem = {
    id: number
    gameId: number
    title: string
    image: string | null
    quantity: number
}

export const getCart = async (): Promise<CartItem[]> => {
    const res = await api.get("/cart")
    return res.data.items
}

export const addToCartRequest = async (payload: {
    gameId: number
    title: string
    image: string | null
    quantity?: number
}) => {
    const res = await api.post("/cart", {
        gameId: payload.gameId,
        title: payload.title,
        image: payload.image,
        quantity: payload.quantity ?? 1
    })

    return res.data
}

export const removeFromCartRequest = async (gameId: number) => {
    const res = await api.delete(`/cart/${gameId}`)
    return res.data
}

export const updateCartQuantityRequest = async (
    gameId: number,
    quantity: number
) => {
    const res = await api.patch(`/cart/${gameId}`, { quantity })
    return res.data
}