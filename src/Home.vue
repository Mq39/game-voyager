<script setup lang="ts">
import MainLayout from './components/MainLayout.vue';

</script>

<template>
    <MainLayout>
        <div id="carouselExampleIndicators" class="carousel slide" data-bs-ride="carousel">
            <div class="carousel-indicators">
                <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="0" class="active"
                    aria-current="true" aria-label="Slide 1"></button>
                <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="1"
                    aria-label="Slide 2"></button>
                <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="2"
                    aria-label="Slide 3"></button>
            </div>
            <div class="carousel-inner">
                <div class="carousel-item active" data-bs-interval="10000">
                    <img src="./assets/GameVoyagerLogo.png" class="d-block w-100 hero-img" alt="...">
                </div>
                <div class="carousel-item" data-bs-interval="10000">
                    <img src="./assets/GameVoyagerLogo.png" class="d-block w-100 hero-img" alt="...">
                </div>
                <div class="carousel-item" data-bs-interval="10000">
                    <img src="./assets/GameVoyagerLogo.png" class="d-block w-100 hero-img" alt="...">
                </div>
            </div>
            <button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleIndicators"
                data-bs-slide="prev">
                <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                <span class="visually-hidden">Previous</span>
            </button>
            <button class="carousel-control-next" type="button" data-bs-target="#carouselExampleIndicators"
                data-bs-slide="next">
                <span class="carousel-control-next-icon" aria-hidden="true"></span>
                <span class="visually-hidden">Next</span>
            </button>
        </div>
    </MainLayout>
</template>

<style>
.hero-img {
    height: 45vh;
    min-height: 280px;
    max-height: 500px;
    object-fit: contain;
}

.carousel-item {
    position: relative;
}

.carousel-item::before {
    content: "";
    position: absolute;
    inset: 0;
    background: linear-gradient(to right, rgba(0, 0, 0, 0.6), transparent);
}
</style>