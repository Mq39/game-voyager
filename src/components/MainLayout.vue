<script lang="ts" setup>
import { onMounted, onBeforeUnmount, nextTick, watch, computed, ref } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();

// Hide price total when on cart page
const showCartPrice = computed(() => route.path !== "/cart");

// Cart icon bounce when entering /cart
const cartAnimation = ref(false);
const triggerIconBounce = () => {
    cartAnimation.value = false;
    requestAnimationFrame(() => {
        cartAnimation.value = true;
        setTimeout(() => (cartAnimation.value = false), 450);
    });
};

watch(
    () => route.path,
    (newPath, oldPath) => {
        if (newPath === "/cart" && oldPath !== "/cart") triggerIconBounce();
    }
);

let cleanup: Array<() => void> = [];

onMounted(async () => {
    await nextTick();

    const nav = document.querySelector(".nav-slider") as HTMLElement | null;
    const indicator = document.querySelector(".nav-indicator") as HTMLElement | null;
    if (!nav || !indicator) return;

    const links = nav.querySelectorAll<HTMLElement>(".nav-item-link");

    const hideIndicator = () => {
        indicator.style.opacity = "0";
        indicator.style.width = "0px";
    };

    const moveIndicator = (linkEl: HTMLElement) => {
        const label = linkEl.querySelector<HTMLElement>(".nav-label") ?? linkEl;

        const labelRect = label.getBoundingClientRect();
        if (labelRect.width === 0 || labelRect.height === 0) {
            hideIndicator();
            return;
        }

        const navRect = nav.getBoundingClientRect();

        const left = labelRect.left - navRect.left;
        const width = labelRect.width;
        const top = labelRect.bottom - navRect.top + 6;

        indicator.style.width = `${width}px`;
        indicator.style.transform = `translate(${left}px, ${top}px)`;
        indicator.style.opacity = "1";
    };

    const moveToActive = () => {
        const activeTab = nav.querySelector<HTMLElement>(".nav-tab.active");
        if (activeTab) moveIndicator(activeTab);
        else hideIndicator();
    };

    // Disable / enable transition so we can "snap" without animation
    const setIndicatorTransition = (on: boolean) => {
        indicator.style.setProperty("--indicator-transition", on ? "" : "none");
    };

    const snapToActive = async () => {
        await nextTick();
        setIndicatorTransition(false);     // disable animation
        moveToActive();                   // jump instantly
        indicator.getBoundingClientRect(); // force reflow
        setIndicatorTransition(true);      // restore animation for hover
    };

    // Bootstrap collapse events: snap on open/close to avoid sliding from old position
    const collapseEl = document.getElementById("navbarSupportedContent");
    if (collapseEl) {
        const onShown = () => {
            snapToActive(); // dropdown opened -> instantly position under active dropdown item
        };

        const onHidden = () => {
            snapToActive(); // dropdown closed -> instantly position under active desktop item
        };

        collapseEl.addEventListener("shown.bs.collapse", onShown);
        collapseEl.addEventListener("hidden.bs.collapse", onHidden);

        cleanup.push(() => collapseEl.removeEventListener("shown.bs.collapse", onShown));
        cleanup.push(() => collapseEl.removeEventListener("hidden.bs.collapse", onHidden));
    }

    // Hover behavior (animated)
    links.forEach((link) => {
        const onEnter = () => moveIndicator(link);
        const onLeave = () => moveToActive();

        link.addEventListener("mouseenter", onEnter);
        link.addEventListener("mouseleave", onLeave);

        cleanup.push(() => link.removeEventListener("mouseenter", onEnter));
        cleanup.push(() => link.removeEventListener("mouseleave", onLeave));
    });

    const onNavLeave = () => moveToActive();
    nav.addEventListener("mouseleave", onNavLeave);
    cleanup.push(() => nav.removeEventListener("mouseleave", onNavLeave));

    const onResize = () => {
        // snap on resize to avoid weird sliding when layout changes
        snapToActive();
    };
    window.addEventListener("resize", onResize);
    cleanup.push(() => window.removeEventListener("resize", onResize));

    // Initial position
    moveToActive();

    // Route changes: animate normally (slide). If you want snap instead, call snapToActive().
    watch(
        () => route.fullPath,
        async () => {
            await nextTick();
            requestAnimationFrame(() => moveToActive());
        }
    );
});

onBeforeUnmount(() => {
    cleanup.forEach((fn) => fn());
    cleanup = [];
});

const year = new Date().getFullYear();
</script>

<template>
    <div class="d-flex align-items-center">
        <RouterLink class="nav-link" to="/" active-class="active">
            <img src="../assets/GameVoyagerLogo.png" width="120" height="120" alt="Logo" class="me-3" />
        </RouterLink>

        <nav class="navbar navbar-expand-lg bg-body-tertiary flex-grow-1">
            <div class="container-fluid">
                <button class="navbar-toggler" type="button" data-bs-toggle="collapse"
                    data-bs-target="#navbarSupportedContent">
                    <span class="navbar-toggler-icon"></span>
                </button>

                <div class="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul class="navbar-nav p-0 me-auto mb-2 mb-lg-0 nav-slider position-relative">
                        <li class="nav-item">
                            <RouterLink
                                class="nav-link nav-item-link nav-tab d-flex justify-content-center justify-content-lg-start"
                                to="/discover" active-class="active">
                                <span class="nav-label">
                                    <i class="fa-solid fa-compass me-2 d-lg-none opacity-75"></i>
                                    Discover
                                </span>
                            </RouterLink>
                        </li>

                        <li class="nav-item">
                            <RouterLink
                                class="nav-link nav-item-link nav-tab d-flex justify-content-center justify-content-lg-start"
                                to="/browse" active-class="active">
                                <span class="nav-label">
                                    <i class="fa-solid fa-gamepad me-2 d-lg-none opacity-75"></i>
                                    Browse
                                </span>
                            </RouterLink>
                        </li>

                        <!-- Mobile-only items -->
                        <li class="nav-item d-lg-none">
                            <RouterLink
                                class="nav-link nav-item-link nav-tab d-flex justify-content-center justify-content-lg-start"
                                to="/cart" active-class="active">
                                <span class="nav-label">
                                    <i class="fa-solid fa-cart-shopping me-2 opacity-75"></i>
                                    Cart
                                </span>
                            </RouterLink>
                        </li>

                        <li class="nav-item d-lg-none">
                            <RouterLink
                                class="nav-link nav-item-link nav-tab d-flex justify-content-center justify-content-lg-start"
                                to="/login" active-class="active">
                                <span class="nav-label">
                                    <i class="fa-solid fa-user me-2 opacity-75"></i>
                                    Login
                                </span>
                            </RouterLink>
                        </li>

                        <!-- Divider + CTA (mobile) -->
                        <li class="nav-item d-lg-none">
                            <hr class="dropdown-divider opacity-25 my-2" />
                        </li>

                        <li class="nav-item d-lg-none">
                            <RouterLink class="btn btn-outline-light w-100 mt-2" to="/browse">
                                Browse Games
                            </RouterLink>
                        </li>

                        <!-- IMPORTANT: keep indicator last -->
                        <span class="nav-indicator"></span>
                    </ul>

                    <!-- Desktop cart -->
                    <RouterLink
                        class="nav-link d-inline-flex align-items-center gap-2 p-0 d-none d-lg-inline-flex glow-link mx-3"
                        to="/cart" active-class="active">
                        <span class="position-relative d-inline-block" :class="{ 'cart-bounce': cartAnimation }">
                            <i class="fa-solid fa-cart-shopping fs-4"></i>
                            <span
                                class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger d-none d-lg-inline"
                                style="font-size: 0.65rem;">
                                1
                            </span>
                        </span>

                        <span v-if="showCartPrice" class="fw-semibold d-none d-lg-inline">€5.74</span>
                    </RouterLink>

                    <!-- Desktop user -->
                    <RouterLink class="nav-link d-none d-lg-inline glow-link mx-3" to="/login" active-class="active">
                        <i class="fa-solid fa-user fs-4"></i>
                    </RouterLink>
                </div>
            </div>
        </nav>
    </div>

    <slot></slot>

    <footer class="mt-3 text-center">&copy; {{ year }} - GameVoyager</footer>
</template>

<style>
.nav-label {
    display: inline-block;
}

/* underline container */
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

/* The single moving line */
.nav-indicator {
    position: absolute;
    left: 0;
    top: 0;
    height: 2px;
    width: 0;

    background: #7C5CFF;
    box-shadow: 0 0 8px #7C5CFF;

    transform: translate(0, 0);
    transition: var(--indicator-transition, transform 220ms ease), width 220ms ease, opacity 220ms ease;

    opacity: 0;
    pointer-events: none;
}

.nav-link:hover {
    color: #7C5CFF;
}

/* Icon glow */
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

/* Cart bounce */
.cart-bounce {
    animation: iconBounce 0.28s ease;
    transform-origin: center;
}

@keyframes iconBounce {
    0% {
        transform: scale(1);
    }

    40% {
        transform: scale(1.06);
    }

    70% {
        transform: scale(0.98);
    }

    100% {
        transform: scale(1);
    }
}

/* mobile dropdown style */
@media (max-width: 991.98px) {
    #navbarSupportedContent {
        margin-top: 10px;
        padding: 12px;
        border-radius: 14px;
        border: 1px solid rgba(255, 255, 255, 0.08);
        background: rgba(0, 0, 0, 0.25);
        backdrop-filter: blur(8px);
    }

    #navbarSupportedContent .nav-link {
        padding: 12px 14px;
        border-radius: 10px;
    }

    #navbarSupportedContent .nav-link:hover {
        background: rgba(255, 255, 255, 0.06);
    }
}
</style>