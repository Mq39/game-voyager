import { api } from "./api"
import type { WishlistItem, AddToWishlistPayload } from "@/models/wishlist.model"

export const getWishlist = async (): Promise<WishlistItem[]> => {
  const res = await api.get("/wishlist")
  return res.data.items
}

export const removeFromWishlist = async (gameId: number) => {
  const res = await api.delete(`/wishlist/${gameId}`)
  return res.data
}

export const addToWishlist = async (game: AddToWishlistPayload) => {
  const res = await api.post("/wishlist", {
    gameId: game.id,
    title: game.title,
    image: game.image
  })
  return res.data
}