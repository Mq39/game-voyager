<script setup lang="ts">
const year = new Date().getFullYear()
</script>

<template>
    <footer class="site-footer">
        <div class="footer-inner">
            <div class="container">
                <div class="footer-top">
                    <div class="footer-brand-block">
                        <h2 class="footer-brand">GameVoyager</h2>
                        <p class="footer-lead">
                            Discover trending titles, compare offers, explore ne w releases,
                            and find your next favorite game in one place.
                        </p>
                        <p class="footer-subtext">
                            Built for players who want a cleaner way to browse games, follow
                            deals, and navigate a growing digital catalog.
                        </p>
                    </div>
                </div>

                <div class="row footer-grid gy-4">
                    <div class="col-12 col-md-6 col-lg-3">
                        <div class="footer-column">
                            <h5 class="footer-title">Browse</h5>
                            <ul class="footer-list">
                                <li>
                                    <RouterLink to="/">Home</RouterLink>
                                </li>
                                <li>
                                    <RouterLink to="/discover">Discover</RouterLink>
                                </li>
                                <li>
                                    <RouterLink to="/browse">Browse Games</RouterLink>
                                </li>
                                <li>
                                    <RouterLink to="/cart">Cart</RouterLink>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div class="col-12 col-md-6 col-lg-3">
                        <div class="footer-column">
                            <h5 class="footer-title">Account</h5>
                            <ul class="footer-list">
                                <li>
                                    <RouterLink to="/login">Login</RouterLink>
                                </li>
                                <li>
                                    <RouterLink to="/register">Register</RouterLink>
                                </li>
                                <li><a href="#">Wishlist</a></li>
                                <li><a href="#">Order History</a></li>
                            </ul>
                        </div>
                    </div>

                    <div class="col-12 col-md-6 col-lg-3">
                        <div class="footer-column">
                            <h5 class="footer-title">Support</h5>
                            <ul class="footer-list">
                                <li><a href="#">FAQ</a></li>
                                <li><a href="#">How buying works</a></li>
                                <li><a href="#">Refund policy</a></li>
                                <li><a href="#">Contact us</a></li>
                            </ul>
                        </div>
                    </div>

                    <div class="col-12 col-md-6 col-lg-3">
                        <div class="footer-column">
                            <h5 class="footer-title">About</h5>
                            <p class="footer-small-text">
                                GameVoyager is a modern storefront concept focused on
                                discovery, deals, and a cleaner browsing experience.
                            </p>

                            <div class="footer-socials">
                                <a href="#" aria-label="Discord"><i class="fa-brands fa-discord"></i></a>
                                <a href="#" aria-label="Instagram"><i class="fa-brands fa-instagram"></i></a>
                                <a href="#" aria-label="X"><i class="fa-brands fa-x-twitter"></i></a>
                                <a href="#" aria-label="YouTube"><i class="fa-brands fa-youtube"></i></a>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="footer-bottom">
                    <div class="footer-bottom-left">
                        © {{ year }} GameVoyager
                    </div>

                    <div class="footer-bottom-right">
                        <a href="#">Privacy</a>
                        <a href="#">Terms</a>
                        <a href="#">Cookies</a>
                    </div>
                </div>
            </div>
        </div>
    </footer>
</template>

<style scoped>
.site-footer {
    width: 100%;
    margin-top: 64px;
    padding: 56px 0 24px;

    background:
        linear-gradient(180deg,
            rgba(23, 18, 51, 0.98),
            rgba(12, 10, 28, 1));

    border-top: 1px solid rgba(255, 255, 255, 0.06);
}

.footer-top {
    margin-bottom: 42px;
    padding-bottom: 28px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}

.footer-brand-block {
    max-width: 760px;
}

.footer-brand {
    margin: 0 0 12px;
    color: #ffffff;
    font-size: 2rem;
    font-weight: 800;
    letter-spacing: -0.02em;
}

.footer-lead {
    margin: 0 0 12px;
    font-size: 1rem;
    line-height: 1.65;
    color: rgba(255, 255, 255, 0.86);
}

.footer-subtext {
    margin: 0;
    font-size: 0.95rem;
    line-height: 1.65;
    color: rgba(255, 255, 255, 0.66);
}

.footer-grid {
    margin-bottom: 36px;
}

.footer-column {
    height: 100%;
}

.footer-title {
    margin-bottom: 14px;
    color: #ffffff;
    font-size: 1rem;
    font-weight: 700;
}

.footer-list {
    list-style: none;
    margin: 0;
    padding: 0;
}

.footer-list li+li {
    margin-top: 10px;
}

.footer-list a,
.footer-bottom-right a {
    color: rgba(255, 255, 255, 0.76);
    text-decoration: none;
    transition: color 0.18s ease, text-shadow 0.18s ease;
}

.footer-list a:hover,
.footer-bottom-right a:hover {
    color: #7C5CFF;
    text-shadow: 0 0 10px rgba(124, 92, 255, 0.35);
}

.footer-small-text {
    margin: 0 0 16px;
    font-size: 0.93rem;
    line-height: 1.6;
    color: rgba(255, 255, 255, 0.68);
}

.footer-socials {
    display: flex;
    gap: 14px;
    align-items: center;
}

.footer-socials a {
    width: 40px;
    height: 40px;
    border-radius: 999px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    text-decoration: none;
    color: #ffffff;
    background: rgba(255, 255, 255, 0.06);
    transition: transform 0.18s ease, background-color 0.18s ease, color 0.18s ease;
}

.footer-socials a:hover {
    transform: translateY(-2px);
    background: rgba(124, 92, 255, 0.18);
    color: #7C5CFF;
}

.footer-bottom {
    padding-top: 18px;
    border-top: 1px solid rgba(255, 255, 255, 0.06);
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 16px;
    flex-wrap: wrap;
    font-size: 0.9rem;
    color: rgba(255, 255, 255, 0.58);
}

.footer-bottom-right {
    display: flex;
    gap: 18px;
    flex-wrap: wrap;
}

@media (max-width: 767.98px) {
    .site-footer {
        padding: 44px 0 22px;
    }

    .footer-brand {
        font-size: 1.65rem;
    }

    .footer-lead,
    .footer-subtext {
        font-size: 0.92rem;
    }

    .footer-bottom {
        flex-direction: column;
        align-items: flex-start;
    }
}
</style>