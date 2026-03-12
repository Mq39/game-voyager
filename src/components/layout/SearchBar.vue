<script setup lang="ts">
import { computed, ref, watch } from "vue"
import { useRoute, useRouter } from "vue-router"
import logo from "@/assets/GameVoyagerLogo.png"

const router = useRouter()
const route = useRoute()

const searchQuery = ref("")
const isOpen = ref(false)

type SearchSuggestion = {
    id: number
    title: string
    image: string
}

const mockSuggestions: SearchSuggestion[] = [
    { id: 1, title: "Elden Ring", image: logo },
    { id: 2, title: "Cyberpunk 2077", image: logo },
    { id: 3, title: "Red Dead Redemption 2", image: logo },
    { id: 4, title: "Baldur's Gate 3", image: logo },
    { id: 5, title: "Hades", image: logo },
    { id: 6, title: "Hollow Knight", image: logo },
    { id: 7, title: "Dead Cells", image: logo },
    { id: 8, title: "Disco Elysium", image: logo }
]

watch(
    () => route.query.search,
    (newSearch) => {
        searchQuery.value = typeof newSearch === "string" ? newSearch : ""
    },
    { immediate: true }
)

const filteredSuggestions = computed(() => {
    const query = searchQuery.value.trim().toLowerCase()

    if (!query) return []

    return mockSuggestions
        .filter((game) => game.title.toLowerCase().includes(query))
        .slice(0, 6)
})

const submitSearch = () => {
    const trimmed = searchQuery.value.trim()
    isOpen.value = false

    router.push({
        path: "/browse",
        query: trimmed ? { search: trimmed } : {}
    })
}

const selectSuggestion = (suggestion: SearchSuggestion) => {
    searchQuery.value = suggestion.title
    isOpen.value = false

    router.push({
        path: "/browse",
        query: { search: suggestion.title }
    })
}

const handleFocus = () => {
    if (filteredSuggestions.value.length > 0) {
        isOpen.value = true
    }
}

const handleInput = () => {
    isOpen.value = filteredSuggestions.value.length > 0
}

const handleBlur = () => {
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
                    aria-label="Search games" autocomplete="off" @focus="handleFocus" @input="handleInput"
                    @blur="handleBlur" />

                <ul v-if="isOpen && filteredSuggestions.length" class="search-dropdown">
                    <li v-for="suggestion in filteredSuggestions" :key="suggestion.id" class="search-dropdown-item"
                        @mousedown.prevent="selectSuggestion(suggestion)">
                        <img :src="suggestion.image" :alt="suggestion.title" class="search-game-thumb" />

                        <span class="search-game-title">
                            {{ suggestion.title }}
                        </span>
                    </li>
                </ul>
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
</style>