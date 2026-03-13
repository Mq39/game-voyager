<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue"
import { useRoute, useRouter } from "vue-router"
import axios from "axios"
import MainLayout from "@/components/layout/MainLayout.vue"
import type { Game } from "@/models/game.model"
import { browseGames } from "@/services/game.service"
import { Router } from "express"

type BrowseGamesResponse = {
    results: Game[]
    count: number
}

type GamePreviewDetails = {
    id: number
    title: string
    description: string
    released: string
    rating: number
    background: string
    website?: string
    genres?: string[]
    platforms?: string[]
    requirements?: string | null
    tags?: string[]
    metacritic?: number
}

const route = useRoute()
const router = useRouter()

const isLoggedIn = ref<boolean>(false)

const games = ref<Game[]>([])
const loading = ref<boolean>(false)
const loadingMore = ref<boolean>(false)
const error = ref<string>("")

const search = ref<string>("")
const genre = ref<string>("")
const platform = ref<string>("")
const ordering = ref<string>("-added")

const page = ref<number>(1)
const pageSize = 20
const totalCount = ref<number>(0)
const hasMore = ref<boolean>(true)

const activePreviewGame = ref<Game | null>(null)
const previewDetails = ref<GamePreviewDetails | null>(null)
const previewLoading = ref<boolean>(false)
const activeFilter = ref<string>("")

let previewRequestId = 0

const genreOptions = [
    { label: "All Genres", value: "" },
    { label: "Action", value: "action" },
    { label: "RPG", value: "role-playing-games-rpg" },
    { label: "Shooter", value: "shooter" },
    { label: "Adventure", value: "adventure" },
    { label: "Strategy", value: "strategy" },
    { label: "Puzzle", value: "puzzle" },
    { label: "Sports", value: "sports" },
    { label: "Racing", value: "racing" }
]

const platformOptions = [
    { label: "All Platforms", value: "" },
    { label: "PC", value: "4" },
    { label: "PlayStation 5", value: "187" },
    { label: "Xbox One", value: "1" },
    { label: "Nintendo Switch", value: "7" }
]

const sortOptions = [
    { label: "Most Popular", value: "-added" },
    { label: "Top Rated", value: "-rating" },
    { label: "Best Metacritic", value: "-metacritic" },
    { label: "Newest", value: "-released" },
    { label: "Name A-Z", value: "name" }
]

const totalLoaded = computed(() => games.value.length)


const addToCart = (game: Game): void => {
    console.log("Add to cart:", game)
}

const toggleWishlist = (game: Game): void => {
    if (!isLoggedIn.value) {
        alert("You must be logged in to wishlist a game!")
        return
    }

    console.log("Toggle wishlist:", game)
}

const syncFromRoute = (): void => {
    search.value = typeof route.query.browseSearch === "string" ? route.query.browseSearch : ""
    genre.value = typeof route.query.genre === "string" ? route.query.genre : ""
    platform.value = typeof route.query.platform === "string" ? route.query.platform : ""
    ordering.value = typeof route.query.ordering === "string" ? route.query.ordering : "-added"
}

const loadPreviewDetails = async (game: Game): Promise<void> => {
    const requestId = ++previewRequestId

    try {
        previewLoading.value = true

        const response = await axios.get<GamePreviewDetails>(
            `https://game-voyager-backend.vercel.app/api/games/${game.id}`
        )

        if (requestId !== previewRequestId) return

        previewDetails.value = response.data
    } catch (err) {
        console.error("Failed to load preview details:", err)

        if (requestId !== previewRequestId) return

        previewDetails.value = null
    } finally {
        if (requestId === previewRequestId) {
            previewLoading.value = false
        }
    }
}

const loadGames = async (reset = false): Promise<void> => {
    try {
        if (reset) {
            loading.value = true
            error.value = ""
            page.value = 1
            games.value = []
            totalCount.value = 0
            hasMore.value = true
            activePreviewGame.value = null
            previewDetails.value = null
        } else {
            if (!hasMore.value || loadingMore.value || loading.value) {
                return
            }

            loadingMore.value = true
        }

        const response = await browseGames({
            search: search.value || undefined,
            genre: genre.value || undefined,
            platform: platform.value || undefined,
            ordering: ordering.value || undefined,
            page: page.value,
            pageSize
        }) as BrowseGamesResponse

        totalCount.value = response.count

        if (reset) {
            games.value = response.results
        } else {
            games.value = [...games.value, ...response.results]
        }

        hasMore.value = games.value.length < response.count && response.results.length > 0

        if (hasMore.value) {
            page.value += 1
        }

        if (games.value.length === 0) {
            activePreviewGame.value = null
            previewDetails.value = null
            return
        }

        if (!activePreviewGame.value || reset) {
            const firstGame = games.value[0]

            if (firstGame) {
                activePreviewGame.value = firstGame
                void loadPreviewDetails(firstGame)
            }
        }
    } catch (err) {
        console.error("Failed to browse games:", err)
        error.value = "Failed to load games."

        if (reset) {
            games.value = []
            totalCount.value = 0
            hasMore.value = false
            activePreviewGame.value = null
            previewDetails.value = null
        }
    } finally {
        loading.value = false
        loadingMore.value = false
    }
}

const applyFilters = async (): Promise<void> => {
    await router.push({
        path: "/browse",
        query: {
            ...(search.value ? { browseSearch: search.value } : {}),
            ...(genre.value ? { genre: genre.value } : {}),
            ...(platform.value ? { platform: platform.value } : {}),
            ...(ordering.value ? { ordering: ordering.value } : {})
        }
    })
}

const handleScroll = async (): Promise<void> => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop
    const windowHeight = window.innerHeight
    const fullHeight = document.documentElement.scrollHeight

    const threshold = 300
    const nearBottom = scrollTop + windowHeight >= fullHeight - threshold

    if (nearBottom && hasMore.value && !loading.value && !loadingMore.value) {
        await loadGames(false)
    }
}

const onHoverGame = async (game: Game): Promise<void> => {
    if (window.innerWidth < 1200) return
    if (activePreviewGame.value?.id === game.id) return

    activePreviewGame.value = game
    await loadPreviewDetails(game)
}

const applyRouteFilter = () => {
    const filter = route.query.filter

    if (typeof filter === "string") {
        activeFilter.value = filter
    } else {
        activeFilter.value = ""
    }
}

watch(
    () => route.query,
    () => applyRouteFilter(),
    { immediate: true }
)

watch(
    () => route.query,
    async () => {
        syncFromRoute()
        await loadGames(true)
    },
    { immediate: true }
)

onMounted(() => {
    window.addEventListener("scroll", handleScroll)
})

onBeforeUnmount(() => {
    window.removeEventListener("scroll", handleScroll)
})
</script>

<template>
    <MainLayout>
        <section class="container py-4 browse-page">
            <div class="browse-header mb-4">
                <div>
                    <h1 class="browse-title">Browse Games</h1>

                    <p v-if="search" class="browse-subtitle">
                        Results for "{{ search }}"
                    </p>

                    <p v-else class="browse-subtitle">
                        Explore the catalog
                    </p>
                </div>
            </div>

            <div class="filter-bar mb-4">
                <div class="row g-3">
                    <div class="col-12 col-lg-4">
                        <input v-model="search" type="text" class="form-control filter-input"
                            placeholder="Search games..." @keyup.enter="applyFilters" />
                    </div>

                    <div class="col-12 col-md-4 col-lg-3">
                        <select v-model="genre" class="form-select filter-input" @change="applyFilters">
                            <option v-for="option in genreOptions" :key="option.value" :value="option.value">
                                {{ option.label }}
                            </option>
                        </select>
                    </div>

                    <div class="col-12 col-md-4 col-lg-2">
                        <select v-model="platform" class="form-select filter-input" @change="applyFilters">
                            <option v-for="option in platformOptions" :key="option.value" :value="option.value">
                                {{ option.label }}
                            </option>
                        </select>
                    </div>

                    <div class="col-12 col-md-4 col-lg-3">
                        <select v-model="ordering" class="form-select filter-input" @change="applyFilters">
                            <option v-for="option in sortOptions" :key="option.value" :value="option.value">
                                {{ option.label }}
                            </option>
                        </select>
                    </div>
                </div>
            </div>

            <div v-if="loading" class="browse-loading">
                <div class="voyager-spinner" role="status" aria-label="Loading games"></div>
            </div>

            <div v-else-if="error" class="browse-state browse-error">
                {{ error }}
            </div>

            <div v-else-if="!games.length" class="browse-state">
                No games found.
            </div>

            <template v-else>
                <div class="browse-results-meta">
                    Showing {{ totalLoaded }} of {{ totalCount }}
                </div>

                <div class="browse-layout">
                    <div class="browse-list">
                        <RouterLink v-for="game in games" :key="game.id" :to="`/games/${game.id}`"
                            class="browse-list-item" :class="{ active: activePreviewGame?.id === game.id }"
                            @mouseenter="onHoverGame(game)">
                            <div class="browse-list-thumb-wrap">
                                <img :src="game.image" :alt="game.title" class="browse-list-thumb" />
                            </div>

                            <div class="browse-list-main">
                                <h3 class="browse-list-title">
                                    {{ game.title }}
                                </h3>

                                <div class="browse-list-meta">
                                    <span>⭐ {{ game.rating ?? "N/A" }}</span>
                                    <span>{{ game.released ?? "Unknown release date" }}</span>
                                </div>
                            </div>

                            <div class="browse-list-actions">
                                <button class="browse-action-btn browse-action-btn-cart"
                                    @click.prevent.stop="addToCart(game)" aria-label="Add to cart" type="button">
                                    Add to Cart
                                </button>

                                <button class="browse-action-btn browse-action-btn-star"
                                    @click.prevent.stop="toggleWishlist(game)" aria-label="Add to wishlist"
                                    type="button">
                                    ★
                                </button>
                            </div>
                        </RouterLink>
                    </div>

                    <aside class="preview-column">
                        <div v-if="activePreviewGame" class="preview-card">
                            <template v-if="previewLoading">
                                <div class="preview-skeleton">
                                    <div class="preview-skeleton-image shimmer"></div>

                                    <div class="preview-skeleton-body">
                                        <div class="preview-skeleton-title shimmer"></div>
                                        <div class="preview-skeleton-subtitle shimmer"></div>
                                        <div class="preview-skeleton-subtitle short shimmer"></div>

                                        <div class="preview-skeleton-line shimmer"></div>
                                        <div class="preview-skeleton-line shimmer"></div>
                                        <div class="preview-skeleton-line short shimmer"></div>

                                        <div class="preview-skeleton-paragraph shimmer"></div>
                                        <div class="preview-skeleton-paragraph shimmer"></div>
                                        <div class="preview-skeleton-paragraph short shimmer"></div>

                                        <div class="preview-skeleton-button shimmer"></div>
                                    </div>
                                </div>
                            </template>

                            <template v-else>
                                <img :src="previewDetails?.background || activePreviewGame.image"
                                    :alt="activePreviewGame.title" class="preview-card-image" />

                                <div class="preview-card-body">
                                    <h3 class="preview-card-title">
                                        {{ previewDetails?.title || activePreviewGame.title }}
                                    </h3>

                                    <div class="preview-card-subtitle">
                                        <span>
                                            ⭐ {{ previewDetails?.rating ?? activePreviewGame.rating ?? "N/A" }}
                                        </span>
                                        <span>
                                            {{ previewDetails?.released || activePreviewGame.released || "Unknown" }}
                                        </span>
                                    </div>

                                    <p v-if="previewDetails?.genres?.length" class="preview-card-section">
                                        <strong>Genres:</strong>
                                        {{ previewDetails.genres.join(", ") }}
                                    </p>

                                    <p v-if="previewDetails?.platforms?.length" class="preview-card-section">
                                        <strong>Platforms:</strong>
                                        {{ previewDetails.platforms.slice(0, 4).join(", ") }}
                                    </p>

                                    <p v-if="previewDetails?.metacritic" class="preview-card-section">
                                        <strong>Metacritic:</strong>
                                        {{ previewDetails.metacritic }}
                                    </p>

                                    <p v-if="previewDetails?.description" class="preview-card-description">
                                        {{ previewDetails.description.slice(0, 180) }}...
                                    </p>

                                    <div class="preview-card-actions">
                                        <RouterLink :to="`/games/${activePreviewGame.id}`" class="preview-card-link">
                                            Go to Game Page
                                        </RouterLink>
                                    </div>
                                </div>
                            </template>
                        </div>
                    </aside>
                </div>

                <div v-if="loadingMore" class="browse-loading">
                    <div class="voyager-spinner" role="status" aria-label="Loading games"></div>
                </div>

                <div v-else-if="!hasMore" class="browse-state browse-end">
                    You've reached the end of the list.
                </div>
            </template>
        </section>
    </MainLayout>
</template>

<style scoped>
.browse-page {
    color: white;
}

.browse-header {
    display: flex;
    justify-content: space-between;
    align-items: end;
    gap: 1rem;
}

.browse-title {
    font-size: 2.2rem;
    font-weight: 800;
    margin-bottom: 0.35rem;
}

.browse-subtitle {
    margin: 0;
    color: rgba(255, 255, 255, 0.65);
}

.browse-results-meta {
    margin-bottom: 0.85rem;
    color: rgba(255, 255, 255, 0.58);
    font-size: 0.92rem;
}

.filter-bar {
    padding: 1rem;
    border-radius: 18px;
    background: rgba(255, 255, 255, 0.04);
    border: 1px solid rgba(255, 255, 255, 0.08);
}

.filter-input {
    background: rgba(255, 255, 255, 0.06);
    border: 1px solid rgba(255, 255, 255, 0.08);
    color: white;
}

.filter-input option {
    background: #1b1d2b;
    color: white;
}


.filter-input:focus {
    background: rgba(255, 255, 255, 0.08);
    border-color: rgba(124, 92, 255, 0.65);
    color: white;
    box-shadow: 0 0 0 0.2rem rgba(124, 92, 255, 0.12);
}

.browse-state {
    padding: 1.5rem 0;
    color: rgba(255, 255, 255, 0.7);
    text-align: center;
}

.browse-error {
    color: #ff6e6e;
}

.browse-end {
    color: rgba(255, 255, 255, 0.5);
}

.browse-layout {
    display: grid;
    grid-template-columns: minmax(0, 1fr) 340px;
    gap: 1.5rem;
    align-items: stretch;
}

.preview-column {
    position: relative;
    align-self: stretch;
    min-height: 100%;
}

.browse-list {
    display: flex;
    flex-direction: column;
    gap: 0;
    min-width: 0;
}

.browse-list-item {
    display: flex;
    align-items: center;
    gap: 1rem;
    width: 100%;
    min-height: 122px;
    background: rgba(255, 255, 255, 0.04);
    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 0;
    transition: background-color 0.16s ease;
    text-decoration: none;
    color: inherit;
}

.browse-list-item:hover,
.browse-list-item.active {
    background: rgba(255, 255, 255, 0.08);
}

.browse-list-actions {
    display: flex;
    align-items: center;
    gap: 0.65rem;
    padding: 0 1rem 0 0;
    margin-left: auto;
    flex-shrink: 0;
}

.browse-action-btn {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(255, 255, 255, 0.06);
    color: white;
    height: 42px;
    border-radius: 999px;
    transition: background-color 0.16s ease, border-color 0.16s ease, transform 0.16s ease;
}

.browse-action-btn:hover {
    background: rgba(255, 255, 255, 0.12);
    border-color: rgba(255, 255, 255, 0.18);
}

.browse-action-btn-cart {
    padding: 0 1rem;
    min-width: 124px;
    font-weight: 700;
}

.browse-action-btn-star {
    width: 42px;
    min-width: 42px;
    padding: 0;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: 1.1rem;
}

.browse-list-thumb-wrap {
    width: 180px;
    min-width: 180px;
    height: 122px;
    background: #1b1d2b;
}

.browse-list-thumb {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
}

.browse-list-main {
    flex: 1;
    min-width: 0;
}

.browse-list-title {
    margin: 0 0 0.55rem;
    font-size: 1.15rem;
    font-weight: 800;
    line-height: 1.3;
    color: white;
}

.browse-list-meta {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    color: rgba(255, 255, 255, 0.65);
    font-size: 0.92rem;
}

.browse-list-side {
    width: 180px;
    min-width: 180px;
    align-self: stretch;
    padding: 1rem;
    border-left: 1px solid rgba(255, 255, 255, 0.08);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-end;
    gap: 0.75rem;
}

.browse-list-score {
    font-size: 1.6rem;
    font-weight: 800;
    color: #25e28a;
}

.browse-list-link {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 132px;
    padding: 0.72rem 1rem;
    border-radius: 999px;
    text-decoration: none;
    color: white;
    background: rgba(124, 92, 255, 0.22);
    transition: background-color 0.16s ease;
}

.browse-list-link:hover {
    background: rgba(124, 92, 255, 0.35);
}

.preview-column {
    position: relative;
    align-self: start;
    height: fit-content;
}

.preview-card {
    position: sticky;
    top: 24px;
    background: #26263a;
    border: 1px solid rgba(255, 255, 255, 0.08);
    box-shadow: 0 18px 50px rgba(0, 0, 0, 0.45);
    overflow: hidden;
}

.preview-card-image {
    width: 100%;
    height: 190px;
    object-fit: cover;
    display: block;
}

.preview-card-body {
    padding: 1rem;
}

.preview-card-title {
    margin: 0 0 0.55rem;
    font-size: 1.1rem;
    font-weight: 800;
    line-height: 1.35;
    color: white;
}

.preview-card-subtitle {
    display: flex;
    flex-direction: column;
    gap: 0.35rem;
    color: rgba(255, 255, 255, 0.72);
    font-size: 0.92rem;
    margin-bottom: 1rem;
}

.preview-card-section {
    margin-bottom: 0.7rem;
    color: rgba(255, 255, 255, 0.82);
    font-size: 0.92rem;
}

.preview-card-description {
    margin: 1rem 0;
    color: rgba(255, 255, 255, 0.68);
    font-size: 0.92rem;
    line-height: 1.5;
}

.preview-card-actions {
    margin-top: 1rem;
}

.preview-card-link {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    min-height: 46px;
    text-decoration: none;
    color: white;
    background: rgba(124, 92, 255, 0.3);
    transition: background-color 0.16s ease;
}

.preview-card-link:hover {
    background: rgba(124, 92, 255, 0.42);
}

.preview-loading {
    padding: 2rem 1rem;
    color: rgba(255, 255, 255, 0.7);
    text-align: center;
}

.preview-skeleton {
    background: #26263a;
}

.preview-skeleton-image {
    width: 100%;
    height: 190px;
    background-color: #2d2d45;
}

.preview-skeleton-body {
    padding: 1rem;
}

.preview-skeleton-title {
    width: 72%;
    height: 24px;
    border-radius: 8px;
    margin-bottom: 0.8rem;
    background-color: #2d2d45;
}

.preview-skeleton-subtitle {
    width: 58%;
    height: 14px;
    border-radius: 6px;
    margin-bottom: 0.5rem;
    background-color: #2d2d45;
}

.preview-skeleton-subtitle.short {
    width: 42%;
    margin-bottom: 1rem;
}

.preview-skeleton-line {
    width: 100%;
    height: 14px;
    border-radius: 6px;
    margin-bottom: 0.65rem;
    background-color: #2d2d45;
}

.preview-skeleton-line.short {
    width: 68%;
    margin-bottom: 1rem;
}

.preview-skeleton-paragraph {
    width: 100%;
    height: 14px;
    border-radius: 6px;
    margin-bottom: 0.55rem;
    background-color: #2d2d45;
}

.preview-skeleton-paragraph.short {
    width: 78%;
    margin-bottom: 1.2rem;
}

.preview-skeleton-button {
    width: 100%;
    height: 46px;
    border-radius: 8px;
    background-color: #2d2d45;
}

.shimmer {
    background: linear-gradient(90deg,
            rgba(255, 255, 255, 0.05) 25%,
            rgba(255, 255, 255, 0.12) 37%,
            rgba(255, 255, 255, 0.05) 63%);
    background-size: 400% 100%;
    animation: preview-skeleton-loading 1.4s ease infinite;
}

@keyframes preview-skeleton-loading {
    0% {
        background-position: 100% 50%;
    }

    100% {
        background-position: 0 50%;
    }
}

@media (max-width: 1199.98px) {
    .browse-layout {
        grid-template-columns: 1fr;
    }

    .preview-column {
        display: none;
    }
}

@media (max-width: 991.98px) {
    .browse-list-item {
        flex-direction: column;
        align-items: stretch;
    }

    .browse-list-thumb-wrap {
        width: 100%;
        min-width: 100%;
        height: 200px;
    }

    .browse-list-main {
        padding: 0 1rem;
    }

    .browse-list-side {
        width: 100%;
        min-width: 100%;
        border-left: none;
        border-top: 1px solid rgba(255, 255, 255, 0.08);
        align-items: stretch;
    }

    .browse-list-link {
        width: 100%;
    }
}

.browse-loading {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 320px;
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
</style>