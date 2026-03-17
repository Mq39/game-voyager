<script setup lang="ts">
import { computed, onMounted, ref } from "vue"
import MainLayout from "@/components/layout/MainLayout.vue"
import { useCart } from "@/composable/useCart"
import GameListItem from "@/components/reusables/GameListItem.vue"
import { confirmRemoveFromCart, showSuccessToast } from "@/utils/alerts"
import type { CartItem } from "@/models/cart.model"

const {
    items,
    loading,
    loadCart,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity
} = useCart()

const error = ref("")

const totalItems = computed(() =>
    items.value.reduce((sum: number, item: CartItem) => sum + item.quantity, 0)
)

const removeItem = async (gameId: number): Promise<void> => {
    const confirmed = await confirmRemoveFromCart()

    if (!confirmed) return

    try {
        await removeFromCart(gameId)
        showSuccessToast("Item removed from cart")
    } catch (err) {
        console.error("Failed to remove item:", err)
    }
}

onMounted(loadCart)
</script>

<template>
    <MainLayout>
        <section class="container py-4 cart-page">
            <div class="cart-header mb-4">
                <h1 class="cart-title">Your Cart</h1>
                <p class="cart-subtitle">{{ totalItems }} item(s)</p>
            </div>

            <div v-if="loading" class="cart-state">Loading cart...</div>
            <div v-else-if="error" class="cart-state cart-error">{{ error }}</div>
            <div v-else-if="!items.length" class="cart-state">Your cart is empty.</div>

            <div v-else class="cart-list">
                <GameListItem v-for="item in items" :key="item.id" :item="{
                    id: item.gameId,
                    title: item.title,
                    image: item.image,
                    subtitleLeft: `Quantity: ${item.quantity}`,
                    to: `/games/${item.gameId}`
                }">
                    <template #actions>
                        <button class="qty-btn" @click.stop="decreaseQuantity(item.gameId)" type="button">
                            −
                        </button>

                        <span class="qty-value">
                            {{ item.quantity }}
                        </span>

                        <button class="qty-btn" @click.stop="increaseQuantity(item.gameId)" type="button">
                            +
                        </button>

                        <button class="cart-remove-btn" @click.stop="removeItem(item.gameId)" type="button">
                            Remove
                        </button>
                    </template>
                </GameListItem>
            </div>
        </section>
    </MainLayout>
</template>

<style scoped>
.cart-page {
    color: white;
}

.cart-title {
    font-size: 2rem;
    font-weight: 800;
    margin-bottom: 0.35rem;
}

.cart-subtitle {
    color: rgba(255, 255, 255, 0.65);
}

.cart-state {
    padding: 2rem 0;
    text-align: center;
    color: rgba(255, 255, 255, 0.72);
}

.cart-error {
    color: #ff6e6e;
}

.cart-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.cart-item {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1rem;
    border-radius: 18px;
    background: rgba(255, 255, 255, 0.04);
    border: 1px solid rgba(255, 255, 255, 0.08);
}

.cart-item-image {
    width: 180px;
    height: 100px;
    object-fit: cover;
    border-radius: 12px;
}

.cart-item-main {
    flex: 1;
}

.cart-item-title {
    margin: 0 0 0.4rem;
    font-size: 1.1rem;
    font-weight: 700;
}

.cart-item-meta {
    margin: 0;
    color: rgba(255, 255, 255, 0.65);
}

.cart-remove-btn {
    border: none;
    padding: 0.7rem 1rem;
    border-radius: 999px;
    background: rgba(255, 80, 80, 0.18);
    color: white;
}

.qty-btn {
    width: 34px;
    height: 34px;
    border-radius: 8px;
    border: none;
    background: rgba(124, 92, 255, 0.25);
    color: white;
    font-weight: 700;
}

.qty-btn:hover {
    background: rgba(124, 92, 255, 0.4);
}

.qty-value {
    width: 32px;
    text-align: center;
    font-weight: 700;
}
</style>