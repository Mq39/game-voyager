<script setup lang="ts">
type GameListItemData = {
    id: number
    title: string
    image: string | null
    subtitleLeft?: string
    subtitleRight?: string
    to: string
}

defineProps<{
    item: GameListItemData
    active?: boolean
    clickable?: boolean
}>()

const emit = defineEmits<{
    mouseenter: []
}>()
</script>

<template>
    <article class="game-list-item" :class="{ active }" @mouseenter="emit('mouseenter')">
        <RouterLink v-if="clickable !== false" :to="item.to" class="game-list-link"
            @click="console.log('router link clicked', item.to)">
            <div class="game-list-thumb-wrap">
                <img :src="item.image ?? undefined" :alt="item.title" class="game-list-thumb" />
            </div>

            <div class="game-list-main">
                <h3 class="game-list-title">{{ item.title }}</h3>

                <div v-if="item.subtitleLeft || item.subtitleRight" class="game-list-meta">
                    <span v-if="item.subtitleLeft">{{ item.subtitleLeft }}</span>
                    <span v-if="item.subtitleRight">{{ item.subtitleRight }}</span>
                </div>
            </div>
        </RouterLink>

        <div v-else class="game-list-link">
            <div class="game-list-thumb-wrap">
                <img :src="item.image ?? undefined" :alt="item.title" class="game-list-thumb" />
            </div>

            <div class="game-list-main">
                <h3 class="game-list-title">{{ item.title }}</h3>

                <div v-if="item.subtitleLeft || item.subtitleRight" class="game-list-meta">
                    <span v-if="item.subtitleLeft">{{ item.subtitleLeft }}</span>
                    <span v-if="item.subtitleRight">{{ item.subtitleRight }}</span>
                </div>
            </div>
        </div>

        <div class="game-list-actions">
            <slot name="actions" />
        </div>
    </article>
</template>

<style scoped>
.game-list-item {
    display: flex;
    align-items: stretch;
    width: 100%;
    min-height: 122px;
    background: rgba(255, 255, 255, 0.04);
    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
    transition: background-color 0.16s ease;
    color: inherit;
}

.game-list-item:hover,
.game-list-item.active {
    background: rgba(255, 255, 255, 0.08);
}

.game-list-link {
    flex: 1;
    min-width: 0;
    display: flex;
    align-items: center;
    gap: 1rem;
    color: inherit;
    text-decoration: none;
    cursor: auto;
}

.game-list-thumb-wrap {
    width: 180px;
    min-width: 180px;
    height: 122px;
    background: #1b1d2b;
    flex-shrink: 0;
}

.game-list-thumb {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
}

.game-list-main {
    flex: 1;
    min-width: 0;
}

.game-list-title {
    margin: 0 0 0.55rem;
    font-size: 1.15rem;
    font-weight: 800;
    line-height: 1.3;
    color: white;
}

.game-list-meta {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    color: rgba(255, 255, 255, 0.65);
    font-size: 0.92rem;
}

.game-list-actions {
    display: flex;
    align-items: center;
    gap: 0.65rem;
    padding: 0 1rem 0 0;
    margin-left: auto;
    flex-shrink: 0;
    position: relative;
    z-index: 2;
}

@media (max-width: 991.98px) {
    .game-list-item {
        flex-direction: column;
        align-items: stretch;
    }

    .game-list-link {
        flex-direction: column;
        align-items: stretch;
    }

    .game-list-thumb-wrap {
        width: 100%;
        min-width: 100%;
        height: 200px;
    }

    .game-list-main {
        padding: 0 1rem;
    }

    .game-list-actions {
        padding: 0 1rem 1rem;
        margin-left: 0;
    }
}
</style>