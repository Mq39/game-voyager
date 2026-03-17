import { computed, ref } from "vue"
import { getCart, addToCartRequest, removeFromCartRequest, updateCartQuantityRequest, } from "@/services/cart.service"
import type { CartItem } from "@/models/cart.model"

const items = ref<CartItem[]>([])
const loading = ref(false)
const initialized = ref(false)

const totalCount = computed(() =>
    items.value.reduce((sum, item) => sum + item.quantity, 0)
)

export const useCart = () => {
    const loadCart = async (): Promise<void> => {
        try {
            loading.value = true
            const data = await getCart()
            items.value = Array.isArray(data) ? data : []
            initialized.value = true
        } catch (error) {
            console.error("Failed to load cart:", error)
            items.value = []
        } finally {
            loading.value = false
        }
    }

    const ensureCartLoaded = async (): Promise<void> => {
        if (!initialized.value) {
            await loadCart()
        }
    }

    const addToCart = async (game: {
        id: number
        title: string
        image: string | null
    }): Promise<void> => {
        await addToCartRequest({
            gameId: game.id,
            title: game.title,
            image: game.image
        })

        const existingItem = items.value.find((item) => item.gameId === game.id)

        if (existingItem) {
            existingItem.quantity += 1
            return
        }

        await loadCart()
    }

    const removeFromCart = async (gameId: number): Promise<void> => {
        await removeFromCartRequest(gameId)
        items.value = items.value.filter((item) => item.gameId !== gameId)
    }

    const increaseQuantity = async (gameId: number): Promise<void> => {
        const item = items.value.find((i) => i.gameId === gameId)
        if (!item) return

        const newQuantity = item.quantity + 1
        await updateCartQuantityRequest(gameId, newQuantity)
        item.quantity = newQuantity
    }

    const decreaseQuantity = async (gameId: number): Promise<void> => {
        const item = items.value.find((i) => i.gameId === gameId)
        if (!item) return

        const newQuantity = item.quantity - 1

        if (newQuantity <= 0) {
            await removeFromCartRequest(gameId)
            items.value = items.value.filter((i) => i.gameId !== gameId)
            return
        }

        await updateCartQuantityRequest(gameId, newQuantity)
        item.quantity = newQuantity
    }

    const clearCartState = (): void => {
        items.value = []
        initialized.value = false
    }

    return {
        items,
        loading,
        totalCount,
        loadCart,
        ensureCartLoaded,
        addToCart,
        removeFromCart,
        increaseQuantity,
        decreaseQuantity,
        clearCartState
    }
}