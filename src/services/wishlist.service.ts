import { api } from "./api"

export type WishlistItem = {
  id: number
  gameId: number
  title: string
  image: string | null
}

export const getWishlist = async (): Promise<WishlistItem[]> => {
  const res = await api.get("/wishlist")
  return res.data.items
}

export const removeFromWishlist = async (gameId: number) => {
  const res = await api.delete(`/wishlist/${gameId}`)
  return res.data
}

export const addToWishlist = async (game: {
  id: number
  title: string
  image: string
}) => {
  const res = await api.post("/wishlist", {
    gameId: game.id,
    title: game.title,
    image: game.image
  })
  return res.data
}