<script setup lang="ts">
import { ref, onMounted, computed, onBeforeUnmount } from "vue"
import { useRoute } from "vue-router"
import axios from "axios"
import MainLayout from "@/components/layout/MainLayout.vue"

type GameDetails = {
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

type Screenshot = {
    id: number
    image: string
}

type Movie = {
    id: number
    name: string
    preview?: string
    video480?: string
    videoMax?: string
}

type MediaItem =
    | {
        id: string
        type: "image"
        src: string
        thumb: string
    }
    | {
        id: string
        type: "video"
        src: string
        thumb: string
        name?: string
    }

const route = useRoute()

const game = ref<GameDetails | null>(null)
const screenshots = ref<Screenshot[]>([])
const movies = ref<Movie[]>([])
const selectedIndex = ref(0)
const loading = ref(true)
const error = ref("")
const activeTab = ref("description")
const hoveredTrailerIndex = ref<number | null>(null)
const mainVideoRef = ref<HTMLVideoElement | null>(null)

const gameData = computed(() => game.value)

const mediaItems = computed<MediaItem[]>(() => {
    if (!game.value) return []

    const items: MediaItem[] = []

    items.push({
        id: `cover-${game.value.id}`,
        type: "image",
        src: game.value.background,
        thumb: game.value.background
    })

    const firstMovie = movies.value[0]
    if (firstMovie && (firstMovie.videoMax || firstMovie.video480)) {
        items.push({
            id: `movie-${firstMovie.id}`,
            type: "video",
            src: firstMovie.videoMax || firstMovie.video480 || "",
            thumb: firstMovie.preview || game.value.background,
            name: firstMovie.name
        })
    }

    screenshots.value.forEach((shot) => {
        items.push({
            id: `shot-${shot.id}`,
            type: "image",
            src: shot.image,
            thumb: shot.image
        })
    })

    return items
})

const selectedMedia = computed(() => mediaItems.value[selectedIndex.value] || null)

const goToPrevMedia = () => {
    if (!mediaItems.value.length) return

    selectedIndex.value =
        selectedIndex.value === 0
            ? mediaItems.value.length - 1
            : selectedIndex.value - 1
}

const goToNextMedia = () => {
    if (!mediaItems.value.length) return

    selectedIndex.value =
        selectedIndex.value === mediaItems.value.length - 1
            ? 0
            : selectedIndex.value + 1
}

const handleKeydown = (event: KeyboardEvent) => {
    if (!mediaItems.value.length) return

    if (event.key === "ArrowLeft") {
        goToPrevMedia()
        return
    }

    if (event.key === "ArrowRight") {
        goToNextMedia()
        return
    }

    if ((event.key === " " || event.code === "Space") && selectedMedia.value?.type === "video") {
        event.preventDefault()

        const video = mainVideoRef.value
        if (!video) return

        if (video.paused) {
            video.play().catch((err) => {
                console.error("Failed to play video:", err)
            })
        } else {
            video.pause()
        }
    }
}

const fetchGame = async () => {
    try {
        const id = route.params.id as string

        const [gameResponse, screenshotsResponse, moviesResponse] = await Promise.all([
            axios.get(`https://game-voyager-backend.vercel.app/api/games/${id}`),
            axios.get(`https://game-voyager-backend.vercel.app/api/games/${id}/screenshots`),
            axios.get(`https://game-voyager-backend.vercel.app/api/games/${id}/movies`)
        ])

        game.value = gameResponse.data
        document.title = `${game.value?.title} | Game Details`
        screenshots.value = screenshotsResponse.data
        movies.value = moviesResponse.data
        selectedIndex.value = 0
    } catch (err) {
        console.error("Failed to fetch game:", err)
        error.value = "Failed to load game."
    } finally {
        loading.value = false
    }
}

onMounted(() => {
    fetchGame()
    window.addEventListener("keydown", handleKeydown)
})

onBeforeUnmount(() => {
    window.removeEventListener("keydown", handleKeydown)
})
</script>

<template>
    <MainLayout>
        <section class="game-page container py-4">
            <div v-if="loading" class="game-skeleton">
                <div class="row g-4">
                    <div class="col-12 col-lg-8">
                        <div class="game-gallery-card skeleton-surface">
                            <div class="skeleton-main-media shimmer"></div>

                            <div class="thumb-row">
                                <div v-for="n in 5" :key="n" class="skeleton-thumb shimmer"></div>
                            </div>
                        </div>
                    </div>

                    <div class="col-12 col-lg-4">
                        <div class="purchase-card skeleton-surface">
                            <div class="skeleton-title shimmer"></div>
                            <div class="skeleton-price-box shimmer"></div>
                            <div class="skeleton-button shimmer"></div>

                            <div class="skeleton-meta-group">
                                <div class="skeleton-meta-line shimmer"></div>
                                <div class="skeleton-meta-line shimmer"></div>
                                <div class="skeleton-meta-line shimmer"></div>
                                <div class="skeleton-meta-line shimmer short"></div>
                            </div>
                        </div>
                    </div>
                </div>

                <section class="tabs-section mt-4">
                    <div class="tabs-bar">
                        <div v-for="n in 4" :key="n" class="skeleton-tab shimmer"></div>
                    </div>

                    <div class="tab-content-card skeleton-surface">
                        <div class="skeleton-content-line shimmer wide"></div>
                        <div class="skeleton-content-line shimmer"></div>
                        <div class="skeleton-content-line shimmer"></div>
                        <div class="skeleton-content-line shimmer"></div>
                        <div class="skeleton-content-line shimmer short"></div>
                    </div>
                </section>
            </div>

            <div v-else-if="error" class="state-message error-message">
                {{ error }}
            </div>

            <template v-else-if="gameData">
                <div class="row g-4">
                    <div class="col-12 col-lg-8">
                        <div class="game-gallery-card">
                            <div class="media-stage">
                                <template v-if="selectedMedia?.type === 'image'">
                                    <img :src="selectedMedia.src" :alt="gameData.title" class="game-main-image" />
                                </template>

                                <template v-else-if="selectedMedia?.type === 'video'">
                                    <video ref="mainVideoRef" class="game-main-video" :src="selectedMedia.src" controls
                                        playsinline preload="metadata" :poster="selectedMedia.thumb"></video>
                                </template>

                                <button v-if="mediaItems.length > 1" class="gallery-arrow gallery-arrow-left"
                                    type="button" @click="goToPrevMedia" aria-label="Previous media">
                                    <i class="fa-solid fa-chevron-left"></i>
                                </button>

                                <button v-if="mediaItems.length > 1" class="gallery-arrow gallery-arrow-right"
                                    type="button" @click="goToNextMedia" aria-label="Next media">
                                    <i class="fa-solid fa-chevron-right"></i>
                                </button>
                            </div>

                            <div v-if="mediaItems.length" class="thumb-row">
                                <button v-for="(item, index) in mediaItems" :key="item.id" class="thumb-btn"
                                    :class="{ active: selectedIndex === index }" type="button"
                                    @click="selectedIndex = index"
                                    @mouseenter="item.type === 'video' ? hoveredTrailerIndex = index : null"
                                    @mouseleave="hoveredTrailerIndex = null">
                                    <div class="thumb-wrap">
                                        <template v-if="item.type === 'video' && hoveredTrailerIndex === index">
                                            <video class="thumb-image" :src="item.src" muted autoplay loop playsinline
                                                preload="metadata"></video>
                                        </template>

                                        <template v-else>
                                            <img :src="item.thumb" :alt="gameData.title" class="thumb-image" />
                                        </template>

                                        <div v-if="item.type === 'video'" class="thumb-play-badge">
                                            ▶
                                        </div>
                                    </div>
                                </button>
                            </div>
                        </div>
                    </div>

                    <div class="col-12 col-lg-4">
                        <aside class="purchase-card">
                            <h1 class="game-title">{{ gameData.title }}</h1>

                            <div class="price-box primary-price">
                                <span class="price-label">Rating</span>
                                <span class="price-value">{{ gameData.rating }}</span>
                            </div>

                            <button class="buy-btn" type="button">
                                Add to cart
                            </button>

                            <div class="purchase-meta">
                                <p><strong>Release date:</strong> {{ gameData.released }}</p>

                                <p v-if="gameData.website">
                                    <strong>Website:</strong>
                                    <a :href="gameData.website" target="_blank" rel="noopener noreferrer">
                                        Visit site
                                    </a>
                                </p>

                                <p v-if="gameData.platforms?.length">
                                    <strong>Platforms:</strong>
                                    {{ gameData.platforms.join(", ") }}
                                </p>

                                <p v-if="gameData.genres?.length">
                                    <strong>Genres:</strong>
                                    {{ gameData.genres.join(", ") }}
                                </p>

                                <p v-if="gameData.metacritic">
                                    <strong>Metacritic:</strong>
                                    {{ gameData.metacritic }}
                                </p>
                            </div>
                        </aside>
                    </div>
                </div>

                <section class="tabs-section mt-4">
                    <div class="tabs-bar">
                        <button class="tab-btn" :class="{ active: activeTab === 'description' }"
                            @click="activeTab = 'description'">
                            Description
                        </button>

                        <button class="tab-btn" :class="{ active: activeTab === 'requirements' }"
                            @click="activeTab = 'requirements'">
                            System Requirements
                        </button>

                        <button class="tab-btn" :class="{ active: activeTab === 'activation' }"
                            @click="activeTab = 'activation'">
                            Activation
                        </button>

                        <button class="tab-btn" :class="{ active: activeTab === 'languages' }"
                            @click="activeTab = 'languages'">
                            Languages
                        </button>
                    </div>

                    <div class="tab-content-card">
                        <template v-if="activeTab === 'description'">
                            <h2>Description</h2>
                            <p>{{ gameData.description }}</p>

                            <p v-if="gameData.tags?.length" class="tag-list">
                                <strong>Tags:</strong>
                                {{ gameData.tags.join(", ") }}
                            </p>
                        </template>

                        <template v-else-if="activeTab === 'requirements'">
                            <h2>System Requirements</h2>
                            <pre v-if="gameData.requirements"
                                class="requirements-text">{{ gameData.requirements }}</pre>
                            <p v-else>Requirements not available.</p>
                        </template>

                        <template v-else-if="activeTab === 'activation'">
                            <h2>Activation</h2>
                            <ol class="activation-list">
                                <li>Purchase the game through GameVoyager.</li>
                                <li>Receive your digital key after checkout.</li>
                                <li>Open your platform client, such as Steam.</li>
                                <li>Redeem the product key in the client.</li>
                                <li>Install and launch the game from your library.</li>
                            </ol>
                        </template>

                        <template v-else>
                            <h2>Languages</h2>
                            <p>
                                Full language support is not currently available from the provider for this title.
                            </p>
                            <p>
                                Check the official store page for audio, subtitles, and interface language details.
                            </p>
                        </template>
                    </div>
                </section>
            </template>
        </section>
    </MainLayout>
</template>

<style scoped>
.game-page {
    color: white;
}

.game-gallery-card,
.purchase-card,
.tab-content-card {
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 18px;
    overflow: hidden;
}

.media-stage {
    position: relative;
}

.game-main-image,
.game-main-video {
    width: 100%;
    height: 460px;
    object-fit: cover;
    display: block;
    background: #1b1d2b;
}

.gallery-arrow {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    z-index: 3;
    width: 46px;
    height: 46px;
    border: none;
    border-radius: 999px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background: rgba(0, 0, 0, 0.5);
    color: white;
    transition: background-color 0.18s ease, transform 0.18s ease;
}

.gallery-arrow:hover {
    background: rgba(124, 92, 255, 0.8);
    transform: translateY(-50%) scale(1.04);
}

.gallery-arrow-left {
    left: 16px;
}

.gallery-arrow-right {
    right: 16px;
}

.thumb-row {
    display: flex;
    gap: 0.75rem;
    padding: 1rem;
    overflow-x: auto;
    scrollbar-width: none;
    -ms-overflow-style: none;
}

.thumb-row::-webkit-scrollbar {
    display: none;
}

.thumb-btn {
    border: none;
    padding: 0;
    background: transparent;
    border-radius: 12px;
    overflow: hidden;
    flex: 0 0 auto;
}

.thumb-wrap {
    position: relative;
}

.thumb-image {
    width: 100px;
    height: 62px;
    object-fit: cover;
    display: block;
    border: 2px solid transparent;
    transition: border-color 0.18s ease, transform 0.18s ease;
    background: #1b1d2b;
}

.thumb-btn.active .thumb-image {
    border-color: #7C5CFF;
    box-shadow: 0 0 12px rgba(124, 92, 255, 0.35);
}

.thumb-btn:hover .thumb-image {
    border-color: #7C5CFF;
    transform: scale(1.02);
}

.thumb-play-badge {
    position: absolute;
    bottom: 6px;
    right: 6px;
    width: 26px;
    height: 26px;
    border-radius: 999px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(0, 0, 0, 0.7);
    color: white;
    font-size: 0.8rem;
    pointer-events: none;
}

.purchase-card {
    padding: 1.25rem;
}

.game-title {
    font-size: 1.55rem;
    font-weight: 800;
    line-height: 1.2;
    margin-bottom: 1.25rem;
}

.price-box {
    border-radius: 14px;
    padding: 0.9rem 1rem;
    margin-bottom: 0.85rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.primary-price {
    background: rgba(255, 255, 255, 0.08);
}

.price-label {
    color: rgba(255, 255, 255, 0.7);
}

.price-value {
    font-size: 1.4rem;
    font-weight: 800;
    color: #25e28a;
}

.buy-btn {
    width: 100%;
    margin-top: 0.75rem;
    border: none;
    border-radius: 999px;
    padding: 0.95rem 1rem;
    font-weight: 700;
    color: white;
    background: #ff9b2f;
    transition: transform 0.18s ease, box-shadow 0.18s ease;
}

.buy-btn:hover {
    transform: translateY(-1px);
    box-shadow: 0 10px 20px rgba(255, 155, 47, 0.25);
}

.purchase-meta {
    margin-top: 1rem;
    color: rgba(255, 255, 255, 0.75);
}

.purchase-meta a {
    color: #7C5CFF;
    text-decoration: none;
}

.purchase-meta a:hover {
    text-decoration: underline;
}

.tabs-section {
    margin-top: 2rem;
}

.tabs-bar {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
    margin-bottom: 1rem;
}

.tab-btn {
    border: none;
    border-radius: 999px;
    padding: 0.7rem 1rem;
    background: rgba(255, 255, 255, 0.06);
    color: rgba(255, 255, 255, 0.75);
    transition: background-color 0.18s ease, color 0.18s ease, box-shadow 0.18s ease;
}

.tab-btn.active {
    background: rgba(124, 92, 255, 0.2);
    color: #7C5CFF;
    box-shadow: 0 0 12px rgba(124, 92, 255, 0.25);
}

.tab-content-card {
    padding: 1.25rem;
}

.tab-content-card h2 {
    font-size: 1.3rem;
    font-weight: 700;
    margin-bottom: 0.8rem;
}

.requirements-text {
    white-space: pre-wrap;
    font-family: inherit;
    color: rgba(255, 255, 255, 0.85);
}

.tag-list {
    margin-top: 1rem;
}

.activation-list {
    margin: 0;
    padding-left: 1.2rem;
}

.state-message {
    min-height: 40vh;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.05rem;
}

.error-message {
    color: #ff8a8a;
}

@media (max-width: 991.98px) {

    .game-main-image,
    .game-main-video {
        height: 320px;
    }

    .thumb-image {
        width: 84px;
        height: 54px;
    }

    .gallery-arrow {
        width: 40px;
        height: 40px;
    }

    .gallery-arrow-left {
        left: 10px;
    }

    .gallery-arrow-right {
        right: 10px;
    }
}

/* skeleton */

.game-skeleton {
    color: white;
}

.skeleton-surface {
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 18px;
    overflow: hidden;
}

.shimmer {
    background: linear-gradient(90deg,
            rgba(255, 255, 255, 0.05) 25%,
            rgba(255, 255, 255, 0.12) 37%,
            rgba(255, 255, 255, 0.05) 63%);
    background-size: 400% 100%;
    animation: skeleton-loading 1.4s ease infinite;
}

.skeleton-main-media {
    width: 100%;
    height: 460px;
    background-color: #1b1d2b;
}

.skeleton-thumb {
    width: 100px;
    height: 62px;
    border-radius: 10px;
    flex: 0 0 auto;
    background-color: #1b1d2b;
}

.skeleton-title {
    width: 78%;
    height: 34px;
    border-radius: 10px;
    margin-bottom: 1.25rem;
}

.skeleton-price-box {
    width: 100%;
    height: 58px;
    border-radius: 14px;
    margin-bottom: 0.85rem;
}

.skeleton-button {
    width: 100%;
    height: 52px;
    border-radius: 999px;
    margin-top: 0.75rem;
}

.skeleton-meta-group {
    margin-top: 1rem;
}

.skeleton-meta-line {
    width: 100%;
    height: 16px;
    border-radius: 8px;
    margin-bottom: 0.8rem;
}

.skeleton-meta-line.short {
    width: 60%;
}

.skeleton-tab {
    width: 140px;
    height: 42px;
    border-radius: 999px;
}

.skeleton-content-line {
    width: 100%;
    height: 16px;
    border-radius: 8px;
    margin-bottom: 0.9rem;
}

.skeleton-content-line.wide {
    width: 85%;
    height: 22px;
    margin-bottom: 1.1rem;
}

.skeleton-content-line.short {
    width: 62%;
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