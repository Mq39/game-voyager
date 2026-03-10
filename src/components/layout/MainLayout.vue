<script lang="ts" setup>
import Footer from "@/components/layout/MainLayout-components/Footer.vue"
import Breadcrumbs from "@/components/layout/MainLayout-components/Breadcrumbs.vue"
import Navbar from "@/components/layout/MainLayout-components/Navbar.vue"
</script>

<template>
    <div class="layout">
        <div class="container main-container">
            <Navbar />
            <Breadcrumbs />
            <main class="page-content">
                <slot />
            </main>
        </div>

        <Footer />
    </div>
</template>

<style scoped>
.layout {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
}

.main-container {
    flex: 1;
}

.page-content {
    width: 100%;
}
</style>