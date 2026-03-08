<script setup lang="ts">
import MainLayout from '../components/MainLayout.vue';
import PopularGamesList from '../components/PopularGamesList.vue';

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
                    <img src="../assets/GameVoyagerLogo.png" class="d-block w-100 hero-img" alt="GameVoyager">
                </div>
                <div class="carousel-item" data-bs-interval="10000">
                    <img src="../assets/GameVoyagerLogo.png" class="d-block w-100 hero-img" alt="GameVoyager">
                </div>
                <div class="carousel-item" data-bs-interval="10000">
                    <img src="../assets/GameVoyagerLogo.png" class="d-block w-100 hero-img" alt="GameVoyager    ">
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
        <section class="promo-section container mt-4">
            <div class="row g-3">
                <div class="col-12 col-md-4">
                    <RouterLink to="/browse?filter=popular" class="promo-card promo-popular">
                        <div class="promo-backdrop"></div>
                        <div class="promo-glow"></div>

                        <div class="promo-content">
                            <span class="promo-tag">Trending now</span>
                            <h3 class="promo-heading">Most Popular</h3>
                            <p class="promo-description">
                                Explore the titles players are picking most this week.
                            </p>
                        </div>
                    </RouterLink>
                </div>

                <div class="col-12 col-md-4">
                    <RouterLink to="/browse?filter=sale" class="promo-card promo-featured">
                        <div class="promo-backdrop"></div>
                        <div class="promo-glow"></div>

                        <div class="promo-content">
                            <span class="promo-tag">Limited time</span>
                            <h3 class="promo-heading">Flash Deals</h3>
                            <p class="promo-description">
                                Grab discounted games and bundles before the offers disappear.
                            </p>
                        </div>
                    </RouterLink>
                </div>

                <div class="col-12 col-md-4">
                    <RouterLink to="/browse?filter=new" class="promo-card promo-new">
                        <div class="promo-backdrop"></div>
                        <div class="promo-glow"></div>

                        <div class="promo-content">
                            <span class="promo-tag">Just dropped</span>
                            <h3 class="promo-heading">New Releases</h3>
                            <p class="promo-description">
                                Check out the latest arrivals added to GameVoyager.
                            </p>
                        </div>
                    </RouterLink>
                </div>
            </div>
        </section>
        <PopularGamesList></PopularGamesList>
    </MainLayout>
</template>

<style scoped>
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

.promo-section {
    margin-bottom: 2rem;
}

.promo-card {
    position: relative;
    display: block;
    min-height: 210px;
    overflow: hidden;
    border-radius: 20px;
    text-decoration: none;
    color: white;
    isolation: isolate;

    border: 1px solid rgba(255, 255, 255, 0.08);
    background: rgba(15, 18, 30, 0.8);
    backdrop-filter: blur(12px);

    transition:
        transform 0.22s ease,
        box-shadow 0.22s ease,
        border-color 0.22s ease;
}

.promo-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 18px 34px rgba(0, 0, 0, 0.35);
    border-color: rgba(124, 92, 255, 0.35);
}

.promo-backdrop,
.promo-glow {
    position: absolute;
    inset: 0;
    pointer-events: none;
}

.promo-backdrop {
    background-size: cover;
    background-position: center;
    opacity: 0.32;
    transform: scale(1.02);
}

.promo-glow {
    background:
        linear-gradient(to top, rgba(8, 10, 18, 0.92), rgba(8, 10, 18, 0.25)),
        radial-gradient(circle at top right, rgba(124, 92, 255, 0.22), transparent 35%);
    z-index: 0;
}

.promo-content {
    position: relative;
    z-index: 1;
    height: 100%;
    padding: 1.35rem;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
}

.promo-tag {
    display: inline-block;
    width: fit-content;
    margin-bottom: 0.5rem;
    padding: 0.28rem 0.6rem;
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.08);
    font-size: 0.78rem;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: rgba(255, 255, 255, 0.82);
}

.promo-heading {
    margin: 0;
    font-size: 1.8rem;
    font-weight: 700;
    line-height: 1.05;
}

.promo-description {
    margin: 0.65rem 0 0;
    max-width: 30ch;
    color: rgba(255, 255, 255, 0.82);
    font-size: 0.96rem;
    line-height: 1.35;
}

/* Tile themes */
.promo-popular {
    background:
        linear-gradient(135deg, rgba(24, 28, 50, 0.95), rgba(14, 17, 29, 0.96));
}

.promo-popular .promo-backdrop {
    background-image:
        linear-gradient(135deg, rgba(124, 92, 255, 0.16), transparent),
        url("../assets/bannerPopular.avif");
}

.promo-featured {
    background:
        linear-gradient(135deg, rgba(78, 18, 130, 0.98), rgba(28, 12, 66, 0.98));
}

.promo-featured .promo-backdrop {
    background-image:
        linear-gradient(135deg, rgba(255, 255, 255, 0.08), transparent),
        url("../assets/bannerFeatured.avif");
}

.promo-featured .promo-heading {
    font-size: 2rem;
}

.promo-new {
    background:
        linear-gradient(135deg, rgba(18, 42, 58, 0.96), rgba(12, 20, 34, 0.96));
}

.promo-new .promo-backdrop {
    background-image:
        linear-gradient(135deg, rgba(0, 255, 180, 0.1), transparent),
        url("../assets/bannerNew.avif");
}

@media (max-width: 767.98px) {
    .promo-card {
        min-height: 170px;
    }

    .promo-heading {
        font-size: 1.5rem;
    }

    .promo-featured .promo-heading {
        font-size: 1.7rem;
    }

    .promo-description {
        font-size: 0.9rem;
    }
}
</style>