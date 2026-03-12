<script setup lang="ts">
import { ref, onMounted } from "vue"
import axios from "axios"

type HeroGame = {
    id: number
    title: string
    image: string
}

const heroGames = ref<HeroGame[]>([])
const loading = ref(true)

const fetchHeroGames = async () => {
    try {
        const response = await axios.get("https://game-voyager-backend.vercel.app/api/games/hero");
        heroGames.value = response.data
    } catch (error) {
        console.error("Failed to fetch hero games:", error)
    } finally {
        loading.value = false
    }
}

onMounted(() => {
    fetchHeroGames()
})
</script>

<template>
    <section class="hero-wrapper">
        <div v-if="loading" class="hero-skeleton">
            <div class="hero-skeleton-overlay">
                <div class="hero-skeleton-title"></div>
                <div class="hero-skeleton-button"></div>
            </div>
        </div>

        <div v-else-if="heroGames.length" id="carouselExampleIndicators" class="carousel slide" data-bs-ride="carousel">
            <div class="carousel-indicators">
                <button v-for="(game, index) in heroGames" :key="game.id" type="button"
                    data-bs-target="#carouselExampleIndicators" :data-bs-slide-to="index"
                    :class="{ active: index === 0 }" :aria-current="index === 0 ? 'true' : undefined"
                    :aria-label="`Slide ${index + 1}`"></button>
            </div>

            <div class="carousel-inner">
                <div v-for="(game, index) in heroGames" :key="game.id" class="carousel-item"
                    :class="{ active: index === 0 }" data-bs-interval="10000">
                    <img :src="game.image" class="d-block w-100 hero-img" :alt="game.title" />

                    <div class="hero-overlay-content">
                        <h2 class="hero-title">{{ game.title }}</h2>
                        <RouterLink :to="`/games/${game.id}`" class="hero-btn">
                            View Game
                        </RouterLink>
                    </div>
                </div>
            </div>

            <button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleIndicators"
                data-bs-slide="prev">
                <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                <span class="visually-hidden">Previous</span>
            </button>

            <button class="carousel-control-next" type="button" data-bs-target="#carouselExampleIndicators"
                data-bs-slide="next">
                <span class="carousel-control-next-icon" aria-hidden="true"></span>
                <span class="visually-hidden">Next</span>
            </button>
        </div>
    </section>
</template>

<style scoped>
.hero-wrapper {
    width: 100%;
}

.hero-skeleton {
    position: relative;
    height: 45vh;
    min-height: 280px;
    max-height: 500px;
    overflow: hidden;
    border-radius: 10px;
    background: linear-gradient(90deg,
            rgba(255, 255, 255, 0.05) 25%,
            rgba(255, 255, 255, 0.12) 37%,
            rgba(255, 255, 255, 0.05) 63%);
    background-size: 400% 100%;
    animation: skeleton-loading 1.4s ease infinite;
}

.hero-skeleton-overlay {
    position: absolute;
    left: 3rem;
    bottom: 3rem;
    z-index: 2;
}

.hero-skeleton-title {
    width: 240px;
    height: 34px;
    border-radius: 8px;
    background: rgba(255, 255, 255, 0.14);
    margin-bottom: 1rem;
}

.hero-skeleton-button {
    width: 130px;
    height: 44px;
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.14);
}

.hero-img {
    height: 45vh;
    min-height: 280px;
    max-height: 500px;
    object-fit: cover;
    object-position: center 5%;
}

.carousel-item {
    position: relative;
}

.carousel-item::before {
    content: "";
    position: absolute;
    inset: 0;
    background: linear-gradient(to right, rgba(0, 0, 0, 0.6), transparent);
}

.hero-overlay-content {
    position: absolute;
    left: 3rem;
    bottom: 3rem;
    z-index: 2;
    color: white;
}

.hero-title {
    font-size: 2rem;
    font-weight: 800;
    margin-bottom: 1rem;
}

.hero-btn {
    display: inline-block;
    padding: 0.75rem 1.25rem;
    border-radius: 999px;
    text-decoration: none;
    color: white;
    background: rgba(124, 92, 255, 0.9);
}

.hero-btn:hover {
    background: rgba(124, 92, 255, 1);
}

@keyframes skeleton-loading {
    0% {
        background-position: 100% 50%;
    }

    100% {
        background-position: 0 50%;
    }
}

@media (max-width: 767.98px) {

    .hero-overlay-content,
    .hero-skeleton-overlay {
        left: 1.25rem;
        bottom: 1.5rem;
    }

    .hero-title {
        font-size: 1.4rem;
    }

    .hero-skeleton-title {
        width: 180px;
        height: 28px;
    }
}
</style>