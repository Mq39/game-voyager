<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue'
import type { Game } from '@/models/game.model'
import axios from "axios"

const games = ref<Game[]>([])
const scrollContainer = ref<HTMLElement | null>(null)
const currentPage = ref(0)
const loading = ref(true)

const formatPrice = (value: number | undefined) => {
    if (value == null) return "N/A"
    return `€${value.toFixed(2)}`
}

const getItemsPerScroll = () => {
    const width = window.innerWidth

    if (width < 576) return 1
    if (width < 768) return 2
    if (width < 1200) return 3
    return 5
}

const getCards = () => {
    if (!scrollContainer.value) return []
    return Array.from(
        scrollContainer.value.querySelectorAll<HTMLElement>('.popular-game-card')
    )
}

const getTotalPages = () => {
    return Math.ceil(games.value.length / getItemsPerScroll())
}

const getTargetLeftForCard = (card: HTMLElement) => {
    if (!scrollContainer.value) return 0

    const containerRect = scrollContainer.value.getBoundingClientRect()
    const cardRect = card.getBoundingClientRect()

    return scrollContainer.value.scrollLeft + (cardRect.left - containerRect.left)
}

const scrollToPage = (page: number, behavior: ScrollBehavior = 'smooth') => {
    if (!scrollContainer.value) return

    const cards = getCards()
    if (!cards.length) return

    const itemsPerScroll = getItemsPerScroll()
    const totalPages = getTotalPages()

    const clampedPage = Math.max(0, Math.min(page, totalPages - 1))
    const targetIndex = clampedPage * itemsPerScroll

    currentPage.value = clampedPage

    if (targetIndex <= 0) {
        scrollContainer.value.scrollTo({
            left: 0,
            behavior,
        })
        return
    }

    const targetCard = cards[targetIndex]
    if (!targetCard) {
        scrollContainer.value.scrollTo({
            left: scrollContainer.value.scrollWidth,
            behavior,
        })
        return
    }

    const targetLeft = getTargetLeftForCard(targetCard)

    scrollContainer.value.scrollTo({
        left: targetLeft,
        behavior,
    })
}

const scrollByPage = (direction: 'left' | 'right') => {
    const nextPage =
        direction === 'right'
            ? currentPage.value + 1
            : currentPage.value - 1

    scrollToPage(nextPage)
}

const handleResize = () => {
    scrollToPage(currentPage.value, 'auto')
}

const fetchPopularGames = async () => {
    try {
        const response = await axios.get("http://localhost:4000/api/games/popular")
        console.log(response.data)
        games.value = response.data
    } catch (error) {
        console.error("Failed to fetch popular games:", error)
    } finally { loading.value = false }
}
onMounted(async () => {
    await fetchPopularGames()
    await nextTick()

    if (scrollContainer.value) {
        scrollContainer.value.scrollLeft = 0
    }

    requestAnimationFrame(() => {
        scrollToPage(0, 'auto')
    })

    window.addEventListener('resize', handleResize)
})

onBeforeUnmount(() => {
    window.removeEventListener('resize', handleResize)
})
</script>

<template>
    <section class="popular-row-section container mt-4">
        <div class="popular-row-header">
            <div>
                <h2 class="popular-row-title">Most Popular Games</h2>
                <RouterLink to="/browse?filter=popular" class="popular-see-all">
                    See all
                </RouterLink>
            </div>

            <div class="popular-row-controls">
                <button type="button" class="popular-arrow-btn" @click="scrollByPage('left')" aria-label="Scroll left">
                    <i class="fa-solid fa-arrow-left"></i>
                </button>

                <button type="button" class="popular-arrow-btn" @click="scrollByPage('right')"
                    aria-label="Scroll right">
                    <i class="fa-solid fa-arrow-right"></i>
                </button>
            </div>
        </div>

        <div ref="scrollContainer" class="popular-scroll-row">
            <div ref="scrollContainer" class="popular-scroll-row">

                <!-- Skeleton cards while loading -->
                <div v-if="loading" v-for="n in 10" :key="'skeleton-' + n" class="popular-game-card skeleton-card">
                    <div class="skeleton-image"></div>

                    <div class="popular-game-body">
                        <div class="skeleton-title"></div>
                        <div class="skeleton-price"></div>
                    </div>
                </div>


                <!-- Real cards once data loads -->
                <RouterLink v-else v-for="game in games" :key="game.id" :to="`/browse?game=${game.id}`"
                    class="popular-game-card">
                    <div class="popular-game-image-wrap">
                        <img :src="game.image" :alt="game.title" class="popular-game-image" />

                        <div class="popular-rank-badge">
                            #{{ game.rank }}
                        </div>

                        <div v-if="game.badge" class="popular-status-badge">
                            {{ game.badge }}
                        </div>
                    </div>

                    <div class="popular-game-body">
                        <h3 class="popular-game-title">
                            {{ game.title }}
                        </h3>

                        <div class="popular-price-block">
                            <span v-if="game.oldPrice" class="popular-old-price">
                                {{ formatPrice(game.oldPrice) }}
                            </span>

                            <span class="popular-price">
                                {{ formatPrice(game.price) }}
                            </span>
                        </div>
                    </div>
                </RouterLink>

            </div>
        </div>
    </section>
</template>

<style scoped>
.popular-row-section {
    margin-bottom: 2.5rem;
}

.popular-row-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
    margin-bottom: 1rem;
}

.popular-row-title {
    margin: 0;
    font-size: 1.8rem;
    font-weight: 700;
    color: white;
}

.popular-see-all {
    display: inline-block;
    margin-top: 0.35rem;
    color: rgba(255, 255, 255, 0.78);
    text-decoration: none;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    font-size: 0.82rem;
}

.popular-see-all:hover {
    color: #7C5CFF;
}

.popular-row-controls {
    display: flex;
    gap: 0.6rem;
    flex-shrink: 0;
}

.popular-arrow-btn {
    width: 42px;
    height: 42px;
    border: none;
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.12);
    color: white;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    transition: background-color 0.2s ease, transform 0.2s ease;
}

.popular-arrow-btn:hover {
    background: rgba(124, 92, 255, 0.3);
    transform: translateY(-1px);
}

.popular-scroll-row {
    display: flex;
    gap: 1rem;
    overflow-x: auto;
    overflow-y: hidden;
    scroll-behavior: smooth;
    overscroll-behavior-x: contain;
    -webkit-overflow-scrolling: touch;
    padding-bottom: 0.25rem;
    scrollbar-width: none;
    -ms-overflow-style: none;
}

.popular-scroll-row::-webkit-scrollbar {
    display: none;
}

.popular-game-card {
    flex: 0 0 240px;
    text-decoration: none;
    color: white;
    border-radius: 18px;
    overflow: hidden;
    background: rgba(255, 255, 255, 0.06);
    border: 1px solid rgba(255, 255, 255, 0.08);
    transition: box-shadow 0.22s ease, border-color 0.22s ease;
}

.popular-game-card:hover {
    box-shadow: 0 14px 26px rgba(0, 0, 0, 0.28);
    border-color: rgba(124, 92, 255, 0.35);
}

.popular-game-image-wrap {
    position: relative;
    aspect-ratio: 3 / 4;
    overflow: hidden;
    background: #1b1d2b;
}

.popular-game-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    transition: transform 0.4s cubic-bezier(0.22, 1, 0.36, 1);
}

.popular-game-card:hover .popular-game-image {
    transform: scale(1.06);
}

.popular-rank-badge {
    position: absolute;
    left: 12px;
    bottom: 12px;
    min-width: 52px;
    height: 52px;
    padding: 0 10px;
    border-radius: 999px;
    background: rgba(16, 18, 30, 0.92);
    color: white;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    font-size: 1.2rem;
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.28);
}

.popular-status-badge {
    position: absolute;
    top: 12px;
    right: 12px;
    padding: 0.3rem 0.55rem;
    border-radius: 999px;
    background: rgba(124, 92, 255, 0.9);
    color: white;
    font-size: 0.72rem;
    font-weight: 600;
    letter-spacing: 0.03em;
}

.popular-game-body {
    padding: 1rem 1rem 1.1rem;
}

.popular-game-title {
    margin: 0;
    font-size: 1.35rem;
    line-height: 1.15;
    font-weight: 700;
    min-height: 3.1rem;
}

.popular-price-block {
    margin-top: 0.9rem;
    display: flex;
    align-items: center;
    gap: 0.55rem;
    flex-wrap: wrap;
}

.popular-old-price {
    color: rgba(255, 255, 255, 0.48);
    text-decoration: line-through;
    font-size: 0.95rem;
}

.popular-price {
    color: #25e28a;
    font-size: 1.45rem;
    font-weight: 800;
}

@media (max-width: 1199.98px) {
    .popular-game-card {
        flex-basis: 220px;
    }
}

@media (max-width: 767.98px) {
    .popular-row-title {
        font-size: 1.45rem;
    }

    .popular-game-card {
        flex-basis: 200px;
    }

    .popular-game-title {
        font-size: 1.1rem;
        min-height: 2.7rem;
    }

    .popular-price {
        font-size: 1.2rem;
    }

    .popular-rank-badge {
        min-width: 46px;
        height: 46px;
        font-size: 1rem;
    }
}

@media (max-width: 575.98px) {
    .popular-row-header {
        align-items: flex-start;
    }

    .popular-game-card {
        flex-basis: 180px;
    }
}

.skeleton-card {
    pointer-events: none;
}

.skeleton-image {
    width: 100%;
    aspect-ratio: 3 / 4;
    background: linear-gradient(90deg,
            rgba(255, 255, 255, 0.05) 25%,
            rgba(255, 255, 255, 0.12) 37%,
            rgba(255, 255, 255, 0.05) 63%);
    background-size: 400% 100%;
    animation: skeleton-loading 1.4s ease infinite;
}

.skeleton-title {
    height: 18px;
    width: 70%;
    margin-bottom: 12px;
    border-radius: 6px;
    background: rgba(255, 255, 255, 0.08);
}

.skeleton-price {
    height: 16px;
    width: 40%;
    border-radius: 6px;
    background: rgba(255, 255, 255, 0.08);
}

@keyframes skeleton-loading {
    0% {
        background-position: 100% 50%;
    }

    100% {
        background-position: 0 50%;
    }
}
</style>