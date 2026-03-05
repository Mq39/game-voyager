<script lang="ts" setup>
import { onMounted, onBeforeUnmount, nextTick, watch } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();

let cleanup: Array<() => void> = [];

onMounted(async () => {
    await nextTick();

    const nav = document.querySelector(".nav-slider") as HTMLElement | null;
    const indicator = document.querySelector(".nav-indicator") as HTMLElement | null;
    if (!nav || !indicator) return;

    const links = nav.querySelectorAll<HTMLElement>(".nav-link");

    const moveIndicator = (el: HTMLElement) => {
        // If your nav wraps, you can use offsetLeft; for most navbars it's fine.
        indicator.style.width = `${el.offsetWidth}px`;
        indicator.style.left = `${el.offsetLeft}px`;
        indicator.style.opacity = "1";
    };

    const moveToActive = () => {
        const active = nav.querySelector<HTMLElement>(".nav-link.active");
        if (active) moveIndicator(active);
        else indicator.style.opacity = "0";
    };

    // Hover -> move indicator
    links.forEach((link) => {
        const onEnter = () => moveIndicator(link);
        link.addEventListener("mouseenter", onEnter);
        cleanup.push(() => link.removeEventListener("mouseenter", onEnter));
    });

    // Leave nav -> return to active
    const onLeave = () => moveToActive();
    nav.addEventListener("mouseleave", onLeave);
    cleanup.push(() => nav.removeEventListener("mouseleave", onLeave));

    // On resize -> recalc position
    const onResize = () => moveToActive();
    window.addEventListener("resize", onResize);
    cleanup.push(() => window.removeEventListener("resize", onResize));

    // Initial position
    moveToActive();

    // When route changes -> move to active after DOM updates
    watch(
        () => route.fullPath,
        async () => {
            await nextTick();
            moveToActive();
        }
    );
});

onBeforeUnmount(() => {
    cleanup.forEach((fn) => fn());
    cleanup = [];
});


const year = new Date().getFullYear()
</script>

<template>

    <div class="d-flex align-items-center">
        <RouterLink class="nav-link" to="/" active-class="active">
            <img src="../assets/GameVoyagerLogo.png" style="height:120px;" alt="Logo" class="me-3">
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

                        </li>
                        <li class="nav-item">
                            <RouterLink class="nav-link glow-link" to="/discover" active-class="active">
                                Discover
                            </RouterLink>
                        </li>
                        <li class="nav-item">
                            <RouterLink class="nav-link glow-link" to="/browse" active-class="active">
                                Browse
                            </RouterLink>
                        </li>
                        <span class="nav-indicator"></span>
                    </ul>

                    <div class="glow-link mx-3">
                        <RouterLink class="nav-link d-flex align-items-center gap-2 p-0" to="/cart">
                            <span class="position-relative d-inline-block">
                                <i class="fa-solid fa-cart-shopping fs-4"></i>


                                <span
                                    class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
                                    style="font-size: 0.65rem;">
                                    1
                                </span>
                            </span>

                            <span class="fw-semibold">€5.74</span>
                        </RouterLink>
                    </div>

                    <RouterLink class="nav-link" to="/login" active-class="active">
                        <div class="glow-link mx-2">
                            <i class="fa-solid fa-user  fs-4"></i>
                        </div>
                    </RouterLink>

                </div>
            </div>
        </nav>

    </div>
    <slot></slot>
    <footer class="mt-3 text-center">&copy; {{ year }} - GameVoyager</footer>
</template>

<style>
.glow-link {
    position: relative;
    display: inline-block;
}

/* underline element */
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
    bottom: 2px;
    /* tweak if needed */
    left: 0;
    height: 2px;
    width: 0;

    background: #7C5CFF;
    box-shadow: 0 0 8px #7C5CFF;

    transition: left 220ms ease, width 220ms ease, opacity 220ms ease;
    opacity: 0;
    pointer-events: none;
}

/* hover animation */
.glow-link:hover::after {
    width: 100%;
}

/* active route highlight */
.glow-link.active::after {
    width: 100%;
}

.nav-link:hover {
    color: #7C5CFF;
}
</style>