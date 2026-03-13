<script setup lang="ts">
import { useRoute } from "vue-router"
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue"

type BreadcrumbItem = {
    label: string
    to?: string
}

const route = useRoute()
const dynamicBreadcrumbs = ref<BreadcrumbItem[]>([])

const staticBreadcrumbs = computed<BreadcrumbItem[]>(() => {
    const value = route.meta.breadcrumb

    if (Array.isArray(value)) {
        return value as BreadcrumbItem[]
    }

    if (typeof value === "string" && value.trim()) {
        return [{ label: value }]
    }

    return []
})

const breadcrumbs = computed<BreadcrumbItem[]>(() => {
    if (route.path.startsWith("/games/") && dynamicBreadcrumbs.value.length) {
        return dynamicBreadcrumbs.value
    }

    return staticBreadcrumbs.value
})

const handleBreadcrumbsUpdate = (event: Event) => {
    const customEvent = event as CustomEvent<BreadcrumbItem[]>
    dynamicBreadcrumbs.value = customEvent.detail ?? []
}

watch(
    () => route.fullPath,
    (newPath) => {
        if (!newPath.startsWith("/games/")) {
            dynamicBreadcrumbs.value = []
        }
    },
    { immediate: true }
)

onMounted(() => {
    window.addEventListener("set-breadcrumbs", handleBreadcrumbsUpdate)
})

onBeforeUnmount(() => {
    window.removeEventListener("set-breadcrumbs", handleBreadcrumbsUpdate)
})
</script>

<template>
    <div class="container mt-3 d-none d-lg-block">
        <nav v-if="route.path !== '/'" aria-label="breadcrumb">
            <ol class="breadcrumb">
                <li class="breadcrumb-item">
                    <RouterLink to="/" class="text-decoration-none text-body">
                        Home
                    </RouterLink>
                </li>

                <li v-for="(crumb, index) in breadcrumbs" :key="`${crumb.label}-${index}`" class="breadcrumb-item"
                    :class="{ active: index === breadcrumbs.length - 1 }"
                    :aria-current="index === breadcrumbs.length - 1 ? 'page' : undefined">
                    <RouterLink v-if="crumb.to && index !== breadcrumbs.length - 1" :to="crumb.to"
                        class="text-decoration-none text-body">
                        {{ crumb.label }}
                    </RouterLink>

                    <span v-else>
                        {{ crumb.label }}
                    </span>
                </li>
            </ol>
        </nav>
    </div>
</template>

<style scoped>
.breadcrumb {
    margin-bottom: 1.5rem;
}
</style>