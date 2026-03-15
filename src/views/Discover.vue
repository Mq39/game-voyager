<script setup lang="ts">
import { computed, onMounted, ref } from "vue"
import { useRouter } from "vue-router"
import axios from "axios"
import MainLayout from "@/components/layout/MainLayout.vue"
import type { Game } from "@/models/game.model"
import { browseGames } from "@/services/game.service"

type DiscoverSection = {
    title: string
    subtitle: string
    games: Game[]
}

type BrowseGamesResponse = {
    results: Game[]
    count: number
}

const router = useRouter()

const loading = ref<boolean>(true)
const error = ref<string>("")

const featuredGame = ref<Game | null>(null)

const topRatedGames = ref<Game[]>([])
const newestGames = ref<Game[]>([])

const genreLinks = [
    { label: "Action", value: "action" },
    { label: "RPG", value: "role-playing-games-rpg" },
    { label: "Shooter", value: "shooter" },
    { label: "Adventure", value: "adventure" },
    { label: "Strategy", value: "strategy" },
    { label: "Puzzle", value: "puzzle" },
    { label: "Sports", value: "sports" },
    { label: "Racing", value: "racing" }
]

const sections = computed<DiscoverSection[]>(() => [
    {
        title: "Top Rated",
        subtitle: "Critically loved games worth checking out.",
        games: topRatedGames.value
    },
    {
        title: "Newest Releases",
        subtitle: "Fresh releases and recent titles.",
        games: newestGames.value
    }
])

const hasValidImage = (game: Game): boolean => {
    return typeof game.image === "string" && game.image.trim().length > 0
}

const loadDiscoverData = async (): Promise<void> => {
    try {
        loading.value = true
        error.value = ""

        const [topRatedResponse, newestResponse] = await Promise.all([
            browseGames({
                ordering: "-rating",
                page: 1,
                pageSize: 12
            }) as Promise<BrowseGamesResponse>,
            browseGames({
                ordering: "-released",
                page: 1,
                pageSize: 12
            }) as Promise<BrowseGamesResponse>
        ])

        const filteredTopRated = topRatedResponse.results.filter(hasValidImage)
        const filteredNewest = newestResponse.results.filter(hasValidImage)

        topRatedGames.value = filteredTopRated.slice(0, 8)
        newestGames.value = filteredNewest.slice(0, 8)

        const pool = [...topRatedGames.value, ...newestGames.value]
        if (pool.length > 0) {
            const randomIndex = Math.floor(Math.random() * pool.length)
            featuredGame.value = pool[randomIndex] ?? null
        } else {
            featuredGame.value = null
        }
    } catch (err) {
        console.error("Failed to load discover data:", err)
        error.value = "Failed to load discover page."
    } finally {
        loading.value = false
    }
}

const goToGame = async (gameId: number): Promise<void> => {
    await router.push(`/games/${gameId}`)
}


const openGenre = async (genre: string): Promise<void> => {
    await router.push({
        path: "/browse",
        query: {
            genre
        }
    })
}

onMounted(() => {
    loadDiscoverData()
})
</script>

<template>
    <MainLayout>
        <section class="container py-4 discover-page">
            <div class="discover-hero">
                <div class="discover-hero-content">
                    <p class="discover-kicker">DISCOVER SOMETHING NEW</p>
                    <h1 class="discover-title">Find your next favorite game</h1>
                    <p class="discover-subtitle">
                        Browse standout picks, jump into top-rated titles, or let luck choose a game for you.
                    </p>

                    <div class="discover-hero-actions">
                        <RouterLink to="/browse" class="discover-primary-btn">
                            Browse All Games
                        </RouterLink>
                    </div>
                </div>
            </div>

            <div class="discover-genres">
                <div class="discover-section-header">
                    <h2 class="discover-section-title">Browse by Genre</h2>
                    <p class="discover-section-subtitle">
                        Jump straight into the kinds of games you enjoy most.
                    </p>
                </div>

                <div class="genre-chip-list">
                    <button v-for="genre in genreLinks" :key="genre.value" class="genre-chip" type="button"
                        @click="openGenre(genre.value)">
                        {{ genre.label }}
                    </button>
                </div>
            </div>

            <div v-if="loading" class="discover-loading">
                <div class="voyager-spinner" role="status" aria-label="Loading discover page"></div>
            </div>

            <div v-else-if="error" class="discover-state discover-error">
                {{ error }}
            </div>

            <template v-else>
                <section v-if="featuredGame" class="featured-section">
                    <div class="discover-section-header">
                        <h2 class="discover-section-title">Featured Pick</h2>
                        <p class="discover-section-subtitle">
                            A standout title selected from today’s discovery lineup.
                        </p>
                    </div>

                    <div class="featured-card">
                        <div class="featured-media">
                            <img :src="featuredGame.image" :alt="featuredGame.title" class="featured-image" />
                        </div>

                        <div class="featured-body">
                            <div class="featured-badge">Featured</div>

                            <h3 class="featured-title">{{ featuredGame.title }}</h3>

                            <div class="featured-meta">
                                <span>⭐ {{ featuredGame.rating ?? "N/A" }}</span>
                                <span>{{ featuredGame.released ?? "Unknown release date" }}</span>
                            </div>

                            <div class="featured-actions">
                                <button class="discover-primary-btn" type="button" @click="goToGame(featuredGame.id)">
                                    Go to Game
                                </button>
                            </div>
                        </div>
                    </div>
                </section>

                <section v-for="section in sections" :key="section.title" class="discover-games-section">
                    <div class="discover-section-header">
                        <h2 class="discover-section-title">{{ section.title }}</h2>
                        <p class="discover-section-subtitle">{{ section.subtitle }}</p>
                    </div>

                    <div class="discover-grid">
                        <article v-for="game in section.games" :key="`${section.title}-${game.id}`"
                            class="discover-card">
                            <div class="discover-card-image-wrap">
                                <img :src="game.image" :alt="game.title" class="discover-card-image" />
                            </div>

                            <div class="discover-card-body">
                                <h3 class="discover-card-title">{{ game.title }}</h3>

                                <div class="discover-card-meta">
                                    <span>⭐ {{ game.rating ?? "N/A" }}</span>
                                    <span>{{ game.released ?? "Unknown" }}</span>
                                </div>

                                <button class="discover-card-btn" type="button" @click="goToGame(game.id)">
                                    View Game
                                </button>
                            </div>
                        </article>
                    </div>
                </section>
            </template>
        </section>
    </MainLayout>
</template>

<style scoped>
.discover-page {
    color: white;
}

.discover-hero {
    position: relative;
    overflow: hidden;
    border-radius: 24px;
    padding: 2rem;
    margin-bottom: 2rem;
    background:
        radial-gradient(circle at top right, rgba(124, 92, 255, 0.28), transparent 32%),
        radial-gradient(circle at left center, rgba(168, 85, 247, 0.18), transparent 28%),
        rgba(255, 255, 255, 0.04);
    border: 1px solid rgba(255, 255, 255, 0.08);
}

.discover-hero-content {
    max-width: 720px;
}

.discover-kicker {
    margin: 0 0 0.75rem;
    font-size: 0.82rem;
    font-weight: 800;
    letter-spacing: 0.14em;
    color: #c7b8ff;
}

.discover-title {
    margin: 0 0 0.75rem;
    font-size: 2.35rem;
    font-weight: 900;
    line-height: 1.1;
}

.discover-subtitle {
    margin: 0;
    max-width: 640px;
    font-size: 1rem;
    color: rgba(255, 255, 255, 0.72);
    line-height: 1.6;
}

.discover-hero-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 0.85rem;
    margin-top: 1.5rem;
}

.discover-primary-btn,
.discover-secondary-btn,
.discover-card-btn {
    border: none;
    border-radius: 999px;
    min-height: 44px;
    padding: 0 1.1rem;
    text-decoration: none;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    transition: background-color 0.16s ease, border-color 0.16s ease, transform 0.16s ease;
}

.discover-primary-btn {
    background: rgba(124, 92, 255, 0.28);
    color: white;
    border: 1px solid rgba(124, 92, 255, 0.4);
}

.discover-primary-btn:hover {
    background: rgba(124, 92, 255, 0.42);
}

.discover-secondary-btn {
    background: rgba(255, 255, 255, 0.06);
    color: white;
    border: 1px solid rgba(255, 255, 255, 0.1);
}

.discover-secondary-btn:hover,
.discover-card-btn:hover {
    background: rgba(255, 255, 255, 0.12);
}

.discover-genres,
.featured-section,
.discover-games-section {
    margin-bottom: 2rem;
}

.discover-section-header {
    margin-bottom: 1rem;
}

.discover-section-title {
    margin: 0 0 0.35rem;
    font-size: 1.55rem;
    font-weight: 800;
}

.discover-section-subtitle {
    margin: 0;
    color: rgba(255, 255, 255, 0.65);
}

.genre-chip-list {
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
}

.genre-chip {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(255, 255, 255, 0.05);
    color: white;
    border-radius: 999px;
    padding: 0.7rem 1rem;
    font-weight: 600;
    transition: background-color 0.16s ease, border-color 0.16s ease;
}

.genre-chip:hover {
    background: rgba(124, 92, 255, 0.16);
    border-color: rgba(124, 92, 255, 0.38);
}

.featured-card {
    display: grid;
    grid-template-columns: 1.25fr 1fr;
    gap: 0;
    background: rgba(255, 255, 255, 0.04);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 22px;
    overflow: hidden;
}

.featured-media {
    min-height: 320px;
}

.featured-image {
    width: 100%;
    height: 100%;
    min-height: 320px;
    object-fit: cover;
    display: block;
    background: #1b1d2b;
}

.featured-body {
    padding: 1.4rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
}

.featured-badge {
    display: inline-flex;
    align-self: flex-start;
    margin-bottom: 0.9rem;
    padding: 0.4rem 0.7rem;
    border-radius: 999px;
    background: rgba(124, 92, 255, 0.16);
    color: #d2c5ff;
    font-size: 0.82rem;
    font-weight: 700;
}

.featured-title {
    margin: 0 0 0.8rem;
    font-size: 1.8rem;
    font-weight: 800;
    line-height: 1.2;
}

.featured-meta,
.discover-card-meta {
    display: flex;
    flex-wrap: wrap;
    gap: 0.9rem;
    color: rgba(255, 255, 255, 0.68);
    font-size: 0.92rem;
}

.featured-actions {
    margin-top: 1.25rem;
}

.discover-grid {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 1rem;
}

.discover-card {
    background: rgba(255, 255, 255, 0.04);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 18px;
    overflow: hidden;
    transition: transform 0.18s ease, border-color 0.18s ease, box-shadow 0.18s ease;
}

.discover-card:hover {
    transform: translateY(-4px);
    border-color: rgba(124, 92, 255, 0.28);
    box-shadow: 0 18px 40px rgba(0, 0, 0, 0.24);
}

.discover-card-image-wrap {
    height: 170px;
    background: #1b1d2b;
}

.discover-card-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
}

.discover-card-body {
    padding: 1rem;
}

.discover-card-title {
    margin: 0 0 0.7rem;
    font-size: 1.05rem;
    font-weight: 800;
    line-height: 1.35;
}

.discover-card-btn {
    width: 100%;
    margin-top: 1rem;
    background: rgba(255, 255, 255, 0.06);
    color: white;
    border: 1px solid rgba(255, 255, 255, 0.1);
}

.discover-loading {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 320px;
}

.discover-state {
    padding: 2rem 0;
    text-align: center;
    color: rgba(255, 255, 255, 0.72);
}

.discover-error {
    color: #ff6e6e;
}

.voyager-spinner {
    width: 3rem;
    height: 3rem;
    border: 0.35rem solid rgba(255, 255, 255, 0.15);
    border-top-color: #a855f7;
    border-radius: 50%;
    animation: voyager-spin 0.8s linear infinite;
    box-shadow: 0 0 20px rgba(168, 85, 247, 0.35);
}

@keyframes voyager-spin {
    to {
        transform: rotate(360deg);
    }
}

@media (max-width: 1199.98px) {
    .discover-grid {
        grid-template-columns: repeat(3, minmax(0, 1fr));
    }
}

@media (max-width: 991.98px) {
    .discover-title {
        font-size: 1.9rem;
    }

    .featured-card {
        grid-template-columns: 1fr;
    }

    .discover-grid {
        grid-template-columns: repeat(2, minmax(0, 1fr));
    }
}

@media (max-width: 575.98px) {
    .discover-hero {
        padding: 1.25rem;
    }

    .discover-grid {
        grid-template-columns: 1fr;
    }

    .discover-title {
        font-size: 1.65rem;
    }
}
</style>