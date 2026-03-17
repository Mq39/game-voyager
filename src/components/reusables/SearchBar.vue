<script setup lang="ts">
import { ref, watch } from "vue"
import { useRoute, useRouter } from "vue-router"
import type { Game } from "@/models/game.model"
import { searchGames } from "@/services/game.service"
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

            const result = await searchGames(trimmed, 6)

            if (requestId !== latestRequest) return

            suggestions.value = Array.isArray(result.results) ? result.results : []
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