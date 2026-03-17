<script lang="ts" setup>
import { nextTick, onBeforeUnmount, onMounted, ref, watch, computed } from "vue";
import { useRoute } from "vue-router";
import { getStoredUser, logoutUser } from "@/services/authentication.service";
import type { AuthUser } from "@/models/auth.model";
import { getCart } from "@/services/cart.service";
import { useCart } from "@/composable/useCart.ts"
import SearchBar from '@/components/reusables/SearchBar.vue'
import logo from '@/assets/GameVoyagerLogo.png'
import router from "@/router";


const route = useRoute();
const cartAnimation = ref(false);
const user = ref<AuthUser | null>(null)
const navRef = ref<HTMLElement | null>(null);
const indicatorRef = ref<HTMLElement | null>(null);
const dropdownOpen = ref(false)
const cartItems = ref<any[]>([])
const { totalCount, ensureCartLoaded, clearCartState } = useCart()

let cleanup: Array<() => void> = [];

const avatarUrl = computed(() => {
    if (!user.value) return undefined
    return `https://api.dicebear.com/7.x/adventurer/svg?seed=${user.value.username}`
})

const toggleDropdown = () => {
    dropdownOpen.value = !dropdownOpen.value
}

const handleLogout = async () => {
    logoutUser()
    user.value = null
    dropdownOpen.value = false
    clearCartState()
    await router.push("/")
}

const cartCount = computed(() =>
    cartItems.value.reduce((sum, item) => sum + item.quantity, 0)
)

const loadCart = async () => {
    try {
        cartItems.value = await getCart()
    } catch (error) {
        console.error("Failed to load cart:", error)
    }
}

onMounted(async () => {
    loadCart()
    await ensureCartLoaded()
})

const closeMobileDrawer = () => {
    const drawerEl = document.getElementById("mobileNav");
    if (!drawerEl) return;

    const bootstrap = (window as any).bootstrap;
    if (!bootstrap?.Offcanvas) return;

    const instance = bootstrap.Offcanvas.getInstance(drawerEl)
        ?? new bootstrap.Offcanvas(drawerEl);

    instance.hide();
};

const triggerIconBounce = () => {
    cartAnimation.value = false;

    requestAnimationFrame(() => {
        cartAnimation.value = true;

        setTimeout(() => {
            cartAnimation.value = false;
        }, 500);
    });
};

watch(
    () => route.path,
    (newPath, oldPath) => {
        if (newPath === "/cart" && oldPath !== "/cart") {
            triggerIconBounce();
        }
    },
    { immediate: true }
);
const isDesktop = () => window.innerWidth >= 992;

const hideIndicator = () => {
    if (!indicatorRef.value) return;

    indicatorRef.value.style.opacity = "0";
    indicatorRef.value.style.width = "0px";
};

const moveIndicatorToLink = (linkEl: HTMLElement) => {
    const nav = navRef.value;
    const indicator = indicatorRef.value;

    if (!nav || !indicator || !isDesktop()) {
        hideIndicator();
        return;
    }

    const label = linkEl.querySelector<HTMLElement>(".nav-label") ?? linkEl;
    const labelRect = label.getBoundingClientRect();

    if (labelRect.width === 0 || labelRect.height === 0) return;

    const navRect = nav.getBoundingClientRect();

    const left = labelRect.left - navRect.left;
    const width = labelRect.width;
    const top = labelRect.bottom - navRect.top + 6;

    indicator.style.width = `${width}px`;
    indicator.style.transform = `translate(${left}px, ${top}px)`;
    indicator.style.opacity = "1";
};

const moveIndicatorToActive = () => {
    const nav = navRef.value;
    if (!nav || !isDesktop()) {
        hideIndicator();
        return;
    }

    const activeTab = nav.querySelector<HTMLElement>(".nav-tab.active");

    if (!activeTab) {
        hideIndicator();
        return;
    }

    moveIndicatorToLink(activeTab);
};

onMounted(async () => {
    user.value = getStoredUser()
    await nextTick();

    const nav = navRef.value;
    if (!nav) return;

    const links = nav.querySelectorAll<HTMLElement>(".nav-item-link");

    links.forEach((link) => {
        const handleMouseEnter = () => moveIndicatorToLink(link);
        const handleMouseLeave = () => moveIndicatorToActive();

        link.addEventListener("mouseenter", handleMouseEnter);
        link.addEventListener("mouseleave", handleMouseLeave);

        cleanup.push(() => link.removeEventListener("mouseenter", handleMouseEnter));
        cleanup.push(() => link.removeEventListener("mouseleave", handleMouseLeave));
    });

    const handleNavMouseLeave = () => moveIndicatorToActive();
    nav.addEventListener("mouseleave", handleNavMouseLeave);
    cleanup.push(() => nav.removeEventListener("mouseleave", handleNavMouseLeave));

    const handleResize = () => moveIndicatorToActive();
    window.addEventListener("resize", handleResize);
    cleanup.push(() => window.removeEventListener("resize", handleResize));

    const stopRouteWatcher = watch(
        () => route.fullPath,
        async () => {
            await nextTick();
            requestAnimationFrame(() => moveIndicatorToActive());
        }
    );

    cleanup.push(stopRouteWatcher);

    moveIndicatorToActive();
});

onBeforeUnmount(() => {
    cleanup.forEach((fn) => fn());
    cleanup = [];
});
</script>
<template>
    <div class="d-none d-lg-flex align-items-center">
        <RouterLink class="brand-logo-wrapper" to="/" aria-label="Home">
            <img :src="logo" width="120" height="120" alt="Logo" class="me-3">
        </RouterLink>

        <nav class="navbar navbar-expand-lg bg-body-tertiary flex-grow-1">
            <div class="container-fluid">
                <div class="d-flex align-items-center w-100">
                    <ul ref="navRef" class="navbar-nav p-0  mb-0 nav-slider position-relative">
                        <li class="nav-item">
                            <RouterLink
                                class="nav-link nav-item-link nav-tab d-flex justify-content-center justify-content-lg-start"
                                to="/discover" active-class="active">
                                <span class="nav-label">Discover</span>
                            </RouterLink>
                        </li>

                        <li class="nav-item">
                            <RouterLink
                                class="nav-link nav-item-link nav-tab d-flex justify-content-center justify-content-lg-start"
                                to="/browse" active-class="active">
                                <span class="nav-label">Browse</span>
                            </RouterLink>
                        </li>

                        <span ref="indicatorRef" class="nav-indicator"></span>
                    </ul>

                    <div class="navbar-search-region d-none d-lg-flex">
                        <SearchBar />
                    </div>


                    <div>
                        <RouterLink class="nav-link d-inline-flex align-items-center gap-2 p-0 glow-link mx-3"
                            to="/cart" :class="{ 'cart-bounce': cartAnimation }" active-class="active">
                            <span class="position-relative d-inline-block">
                                <i class="fa-solid fa-cart-shopping fs-4"></i>

                                <span v-if="totalCount > 0"
                                    class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
                                    style="font-size: 0.65rem;">
                                    {{ totalCount }}
                                </span>
                            </span>

                            <span class="fw-semibold">

                            </span>
                        </RouterLink>
                    </div>

                    <template v-if="user">
                        <img :src="avatarUrl" class="avatar" alt="User avatar" @click="toggleDropdown" />

                        <div v-if="dropdownOpen" class="avatar-dropdown">
                            <router-link to="/wishlist" class="dropdown-item">
                                Wishlist
                            </router-link>


                            <button class="dropdown-item logout" @click="handleLogout">
                                Sign Out
                            </button>
                        </div>


                    </template>

                    <template v-else>
                        <RouterLink class="nav-link glow-link mx-3" to="/login" active-class="active">
                            <div class="glow-link mx-2">
                                <i class="fa-solid fa-user fs-4"></i>
                            </div>
                        </RouterLink>
                    </template>

                </div>
            </div>
        </nav>
    </div>


    <div class="mobile-header d-lg-none">
        <button class="mobile-menu-btn" type="button" data-bs-toggle="offcanvas" data-bs-target="#mobileNav"
            aria-controls="mobileNav" aria-label="Open menu">
            <span class="navbar-toggler-icon"></span>
        </button>

        <div class="mobile-logo-link">
            <img :src="logo" alt="Logo" class="mobile-logo">
        </div>

        <div class="mobile-right-actions">
            <RouterLink class="mobile-action-link glow-link" to="/cart" :class="{ 'cart-bounce': cartAnimation }"
                active-class="active" aria-label="Cart">
                <span class="position-relative d-inline-flex">
                    <i class="fa-solid fa-cart-shopping"></i>
                    <span
                        class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger mobile-cart-badge">
                        1
                    </span>
                </span>
            </RouterLink>

            <RouterLink class="mobile-action-link glow-link" to="/login" active-class="active" aria-label="Login">
                <i class="fa-solid fa-user"></i>
            </RouterLink>
        </div>
    </div>


    <div class="offcanvas offcanvas-start mobile-drawer d-lg-none" tabindex="-1" id="mobileNav"
        aria-labelledby="mobileNavLabel">
        <div class="offcanvas-header">
            <h5 class="offcanvas-title" id="mobileNavLabel">GameVoyager</h5>
            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="offcanvas"
                aria-label="Close"></button>
        </div>

        <div class="offcanvas-body">
            <ul class="navbar-nav">
                <li class="nav-item">
                    <RouterLink class="nav-link d-flex align-items-center" to="/" active-class="active"
                        @click="closeMobileDrawer">
                        <i class="fa-solid fa-house me-2 opacity-75"></i>
                        Home
                    </RouterLink>
                </li>

                <li class="nav-item">
                    <RouterLink class="nav-link d-flex align-items-center" to="/discover" active-class="active"
                        @click="closeMobileDrawer">
                        <i class="fa-solid fa-compass me-2 opacity-75"></i>
                        Discover
                    </RouterLink>
                </li>


                <li class="nav-item">
                    <RouterLink class="nav-link d-flex align-items-center" to="/browse" active-class="active"
                        @click="closeMobileDrawer">
                        <i class="fa-solid fa-gamepad me-2 opacity-75"></i>
                        Browse
                    </RouterLink>
                </li>



                <li class="nav-item">
                    <RouterLink class="nav-link d-flex align-items-center" to="/cart" active-class="active"
                        @click="closeMobileDrawer">
                        <i class="fa-solid fa-cart-shopping me-2 opacity-75"></i>
                        Cart
                    </RouterLink>
                </li>

                <li class="nav-item">
                    <RouterLink class="nav-link d-flex align-items-center" to="/login" active-class="active"
                        @click="closeMobileDrawer">
                        <i class="fa-solid fa-user me-2 opacity-75"></i>
                        Login
                    </RouterLink>
                </li>

                <li class="nav-item">
                    <hr class="dropdown-divider opacity-25 my-3">
                </li>

                <li class="nav-item">
                    <RouterLink class="btn btn-outline-light w-100" to="/browse" @click="closeMobileDrawer">
                        Browse Games
                    </RouterLink>
                </li>
            </ul>
        </div>
    </div>
</template>
<style scoped>
.nav-label {
    display: inline-block;
}

.nav-slider {
    position: relative;
}

.nav-slider .nav-link {
    position: relative;
    padding: 10px 16px;
}

.nav-slider .nav-link:hover {
    color: #7C5CFF;
}

.nav-indicator {
    position: absolute;
    left: 0;
    top: 0;
    height: 2px;
    width: 0;
    background: #7C5CFF;
    box-shadow: 0 0 8px #7C5CFF;
    transform: translate(0, 0);
    transition: transform 220ms ease, width 220ms ease, opacity 220ms ease;
    opacity: 0;
    pointer-events: none;
}

.nav-link:hover {
    color: #7C5CFF;
}

.glow-link {
    position: relative;
    display: inline-block;
}

.glow-link.active {
    color: #7C5CFF;
    text-shadow: 0 0 8px #7C5CFF;
}

.glow-link:hover i {
    text-shadow: 0 0 12px #7C5CFF;
}

.cart-bounce {
    animation: iconBounce 0.28s ease;
}

@keyframes iconBounce {
    0% {
        transform: scale(1);
    }

    40% {
        transform: scale(1.2);
    }

    70% {
        transform: scale(0.92);
    }

    100% {
        transform: scale(1);
    }
}

.brand-logo-wrapper {
    display: inline-flex;
    align-items: center;
    flex-shrink: 0;
}

.mobile-header {
    display: flex;
    align-items: center;
    width: 100vw;
    max-width: 100vw;
    min-height: 70px;
    padding: 0 14px;
    margin-left: calc(50% - 50vw);
    margin-right: calc(50% - 50vw);
    background: #2f3136;
    box-sizing: border-box;
}

.mobile-menu-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 44px;
    height: 44px;
    margin-right: 10px;
    padding: 0;
    border: none;
    background: transparent;
    border-radius: 8px;
    flex-shrink: 0;
}

.mobile-menu-btn .navbar-toggler-icon {
    filter: invert(1);
    opacity: 0.95;
}

.mobile-menu-btn:focus,
.mobile-menu-btn:active {
    outline: none;
    box-shadow: none;
}

.mobile-logo-link {
    display: inline-flex;
    align-items: center;
    flex-shrink: 0;
}

.mobile-logo {
    height: 40px;
    width: auto;
    display: block;
    object-fit: contain;
}

.mobile-right-actions {
    margin-left: auto;
    display: flex;
    align-items: center;
    gap: 24px;
}

.mobile-action-link {
    color: #ffffff;
    text-decoration: none;
    font-size: 1.35rem;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 44px;
    height: 44px;
}

.mobile-action-link.active {
    color: #7C5CFF;
    text-shadow: 0 0 8px #7C5CFF;
}

.mobile-action-link:hover i {
    text-shadow: 0 0 12px #7C5CFF;
}

.mobile-cart-badge {
    font-size: 0.6rem;
    min-width: 16px;
    height: 16px;
    padding: 0 4px;
}

.mobile-drawer {
    --bs-offcanvas-width: min(78vw, 320px);
    background: #11131c;
    color: #fff;
    border-right: 1px solid rgba(255, 255, 255, 0.08);
}

.mobile-drawer .offcanvas-title {
    font-weight: 700;
    letter-spacing: 0.3px;
}

.mobile-drawer .nav-link {
    color: rgba(255, 255, 255, 0.88);
    padding: 12px 10px;
    border-radius: 10px;
    transition: background-color 0.2s ease, color 0.2s ease;
}

.mobile-drawer .nav-link:hover,
.mobile-drawer .nav-link.active {
    color: #7C5CFF;
    background: rgba(255, 255, 255, 0.05);
}

.mobile-drawer .offcanvas-body {
    overflow-x: hidden;
}

.mobile-drawer .btn {
    border-radius: 12px;
}

@media (max-width: 991.98px) {
    .nav-indicator {
        display: none;
    }
}

.navbar-search-region {
    flex: 1;
    display: flex;
    align-items: center;
    min-width: 180px;
    margin-left: 16px;
    margin-right: 8px;
}

.avatar {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    cursor: pointer;
    border: 2px solid rgba(124, 92, 255, 0.6);
}

.avatar-container {
    position: relative;
}

.avatar {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    cursor: pointer;
    border: 2px solid rgba(124, 92, 255, 0.6);
}

.avatar-dropdown {
    position: absolute;
    top: 46px;
    right: 0;
    width: 160px;
    background: rgba(20, 20, 20, 0.95);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 10px;
    overflow: hidden;
    backdrop-filter: blur(10px);
    z-index: 1000
}

.dropdown-item {
    display: block;
    width: 100%;
    padding: 10px 14px;
    color: white;
    text-decoration: none;
    background: none;
    border: none;
    text-align: left;
    cursor: pointer;
}

.dropdown-item:hover {
    background: rgba(124, 92, 255, 0.2);
}

.logout {
    color: #ff6e6e;
}
</style>
