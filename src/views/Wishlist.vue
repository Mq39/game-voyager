<script setup lang="ts">
import { computed, onMounted, ref } from "vue"
import MainLayout from "@/components/layout/MainLayout.vue"
import { getWishlist, removeFromWishlist } from "@/services/wishlist.service"
import type { WishlistItem } from "@/models/wishlist.model"
import GameListItem from "@/components/reusables/GameListItem.vue"
import { useCart } from "@/composable/useCart"
import { showSuccessToast } from "@/utils/alerts"

const items = ref<WishlistItem[]>([])
const loading = ref(false)
const error = ref("")

const { addToCart } = useCart()

const totalItems = computed(() => items.value.length)

const loadWishlist = async (): Promise<void> => {
    try {
        loading.value = true
        error.value = ""
        items.value = await getWishlist()
    } catch (err) {
        console.error("Failed to load wishlist:", err)
        error.value = "Failed to load wishlist."
    } finally {
        loading.value = false
    }
}

const removeItem = async (gameId: number): Promise<void> => {
    try {
        await removeFromWishlist(gameId)
        items.value = items.value.filter((item) => item.gameId !== gameId)
        showSuccessToast("Item removed from wishlist")
    } catch (err) {
        console.error("Failed to remove wishlist item:", err)
    }
}

const handleAddToCart = async (item: WishlistItem): Promise<void> => {
    try {
        await addToCart({
            id: item.gameId,
            title: item.title,
            image: item.image
        })
        showSuccessToast("Added to cart")
    } catch (error) {
        console.error("Failed to add to cart:", error)
    }
}



onMounted(() => {
    loadWishlist()
})
</script>

<template>
    <MainLayout>
        <section class="container py-4 wishlist-page">
            <div class="wishlist-header mb-4">
                <h1 class="wishlist-title">Your Wishlist</h1>
                <p class="wishlist-subtitle">{{ totalItems }} game(s)</p>
            </div>

            <div v-if="loading" class="wishlist-state">
                Loading wishlist...
            </div>

            <div v-else-if="error" class="wishlist-state wishlist-error">
                {{ error }}
            </div>

            <div v-else-if="!items.length" class="wishlist-state">
                Your wishlist is empty.
            </div>

            <div v-else class="wishlist-list">
                <GameListItem v-for="item in items" :key="item.id" :item="{
                    id: item.gameId,
                    title: item.title,
                    image: item.image,
                    subtitleLeft: 'Wishlisted',
                    to: `/games/${item.gameId}`
                }">
                    <template #actions>
                        <button class="browse-action-btn browse-action-btn-cart" @click.stop="handleAddToCart(item)"
                            type="button">
                            Add to Cart
                        </button>

                        <button class="browse-action-btn browse-action-btn-remove" @click.stop="removeItem(item.gameId)"
                            type="button">
                            Remove
                        </button>
                    </template>
                </GameListItem>
            </div>
        </section>
    </MainLayout>
</template>

<style scoped>
.wishlist-page {
    color: white;
}

.wishlist-title {
    font-size: 2rem;
    font-weight: 800;
    margin-bottom: 0.35rem;
}

.wishlist-subtitle {
    color: rgba(255, 255, 255, 0.65);
}

.wishlist-state {
    padding: 2rem 0;
    text-align: center;
    color: rgba(255, 255, 255, 0.72);
}

.wishlist-error {
    color: #ff6e6e;
}

.wishlist-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}
</style>