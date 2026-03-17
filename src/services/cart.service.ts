import { api } from "./api"
import type { CartItem, AddToCartPayload } from "@/models/cart.model"

export const getCart = async (): Promise<CartItem[]> => {
    const res = await api.get("/cart")
    console.log("getCart response:", res.data)

    if (Array.isArray(res.data)) {
        return res.data
    }

    if (Array.isArray(res.data?.items)) {
        return res.data.items
    }

    return []
}

export const addToCartRequest = async (payload: AddToCartPayload) => {
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