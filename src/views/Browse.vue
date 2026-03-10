<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";
import MainLayout from '@/components/layout/MainLayout.vue';

const route = useRoute();

const searchTerm = computed(() => String(route.query.search ?? ""));
</script>

<template>
    <MainLayout>
        <h1>Browse Games</h1>
        <p v-if="searchTerm">Showing results for: <strong>{{ searchTerm }}</strong></p>
    </MainLayout>
</template>