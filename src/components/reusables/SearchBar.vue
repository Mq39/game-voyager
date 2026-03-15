<script setup lang="ts">
import { ref, watch } from "vue"
import { useRoute, useRouter } from "vue-router"
import type { Game } from "@/models/game.model"
import { searchGames } from "@/services/game.service.ts"
import logo from "@/assets/GameVoyagerLogo.png"

const router = useRouter()
const route = useRoute()

const searchQuery = ref<string>("")
const isOpen = ref<boolean>(false)
const isLoading = ref<boolean>(false)
const searchError = ref<string>("")
const suggestions = ref<Game[]>([])

let debounceTimer: ReturnType<typeof setTimeout> | null = null
let latestRequest = 0

watch(
    () => route.query.search,
    (newSearch) => {
        searchQuery.value = typeof newSearch === "string" ? newSearch : ""
    },
    { immediate: true }
)

watch(searchQuery, (newValue: string) => {
    const trimmed = newValue.trim()

    searchError.value = ""

    if (debounceTimer) {
        clearTimeout(debounceTimer)
    }

    if (!trimmed) {
        suggestions.value = []
        isOpen.value = false
        isLoading.value = false
        return
    }

    debounceTimer = setTimeout(async () => {
        const requestId = ++latestRequest

        try {
            isLoading.value = true

            const results = await searchGames(trimmed, 6)

            if (requestId !== latestRequest) return

            suggestions.value = results
            isOpen.value = true
        } catch (error) {
            console.error("Failed to fetch search suggestions:", error)

            if (requestId !== latestRequest) return

            suggestions.value = []
            isOpen.value = false
            searchError.value = "Failed to load suggestions"
        } finally {
            if (requestId === latestRequest) {
                isLoading.value = false
            }
        }
    }, 350)
})

const submitSearch = async (): Promise<void> => {
    const trimmed = searchQuery.value.trim()
    isOpen.value = false

    await router.push({
        path: "/browse",
        query: trimmed ? { search: trimmed } : {}
    })
}

const selectSuggestion = async (suggestion: Game): Promise<void> => {
    isOpen.value = false
    searchQuery.value = ""

    await router.push({
        path: `/games/${suggestion.id}`
    })
}

const handleFocus = (): void => {
    if (suggestions.value.length > 0) {
        isOpen.value = true
    }
}

const handleBlur = (): void => {
    setTimeout(() => {
        isOpen.value = false
    }, 150)
}
</script>

<template>
    <div class="searchbar-root">
        <form class="navbar-search" @submit.prevent="submitSearch">
            <div class="search-input-wrap">
                <i class="fa-solid fa-magnifying-glass search-icon"></i>

                <input v-model="searchQuery" type="text" class="form-control search-input" placeholder="Search games..."
                    aria-label="Search games" autocomplete="off" @focus="handleFocus" @blur="handleBlur"
                    @keydown.esc="isOpen = false" />

                <ul v-if="isOpen && suggestions.length" class="search-dropdown">
                    <li v-for="suggestion in suggestions" :key="suggestion.id" class="search-dropdown-item"
                        @mousedown.prevent="selectSuggestion(suggestion)">
                        <img :src="suggestion.image || logo" :alt="suggestion.title" class="search-game-thumb" />

                        <span class="search-game-title">
                            {{ suggestion.title }}
                        </span>
                    </li>
                </ul>

                <div v-else-if="isOpen && !isLoading && searchQuery.trim() && !suggestions.length"
                    class="search-status">
                    No games found.
                </div>

                <div v-if="isLoading" class="search-status">
                    Loading...
                </div>

                <div v-else-if="searchError" class="search-status text-danger">
                    {{ searchError }}
                </div>
            </div>
        </form>
    </div>
</template>

<style scoped>
.searchbar-root {
    width: 100%;
}

.navbar-search {
    width: 100%;
}

.search-input-wrap {
    position: relative;
    width: 100%;
}

.search-icon {
    position: absolute;
    left: 14px;
    top: 50%;
    transform: translateY(-50%);
    color: rgba(255, 255, 255, 0.55);
    pointer-events: none;
    font-size: 0.9rem;
    z-index: 2;
}

.search-input {
    height: 42px;
    width: 100%;
    padding-left: 40px;
    border-radius: 1000px;
    border: 1px solid rgba(255, 255, 255, 0.08);
    background: rgba(255, 255, 255, 0.06);
    color: #ffffff;
    box-shadow: none;
}

.search-input::placeholder {
    color: rgba(255, 255, 255, 0.45);
}

.search-input:focus {
    background: rgba(255, 255, 255, 0.08);
    border-color: rgba(124, 92, 255, 0.65);
    color: #ffffff;
    box-shadow: 0 0 0 0.2rem rgba(124, 92, 255, 0.12);
}

.search-dropdown {
    position: absolute;
    top: calc(100% + 8px);
    left: 0;
    right: 0;
    margin: 0;
    padding: 8px;
    list-style: none;
    border-radius: 16px;
    background: #171a24;
    border: 1px solid rgba(255, 255, 255, 0.08);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.35);
    z-index: 20;
}

.search-dropdown-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 10px 12px;
    border-radius: 10px;
    color: rgba(255, 255, 255, 0.88);
    cursor: pointer;
    transition: background-color 0.18s ease, color 0.18s ease;
}

.search-dropdown-item:hover {
    background: rgba(255, 255, 255, 0.05);
    color: #7c5cff;
}

.search-game-thumb {
    width: 42px;
    height: 42px;
    object-fit: cover;
    border-radius: 10px;
    flex-shrink: 0;
    background: rgba(255, 255, 255, 0.04);
}

.search-game-title {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
}

.search-status {
    position: absolute;
    top: calc(100% + 8px);
    left: 0;
    right: 0;
    padding: 12px 16px;
    border-radius: 16px;
    background: #171a24;
    border: 1px solid rgba(255, 255, 255, 0.08);
    color: rgba(255, 255, 255, 0.75);
    z-index: 20;
}
</style>