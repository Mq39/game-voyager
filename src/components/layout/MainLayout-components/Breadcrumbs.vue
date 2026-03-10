<script setup lang="ts">
import { useRoute } from "vue-router"
import { computed } from "vue"

const route = useRoute()

const currentBreadcrumb = computed(() => {
    return route.meta.breadcrumb
})

</script>
<template>
    <div class="container mt-3 d-none d-lg-block">
        <nav v-if="route.path !== '/'" aria-label="breadcrumb">
            <ol class="breadcrumb">

                <li class="breadcrumb-item">
                    <RouterLink to="/" class="text-decoration-none text-body">Home</RouterLink>
                </li>

                <li v-if="currentBreadcrumb" class="breadcrumb-item active" aria-current="page">
                    {{ currentBreadcrumb }}
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
