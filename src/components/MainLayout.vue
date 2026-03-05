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

    const links = nav.querySelectorAll<HTMLElement>(".nav-item-link");

    const moveIndicator = (el: HTMLElement) => {
        const elRect = el.getBoundingClientRect();
        if (elRect.width === 0 || elRect.height === 0) return; // prevent top-left bug

        const navRect = nav.getBoundingClientRect();

        const left = elRect.left - navRect.left;
        const width = elRect.width;
        const top = elRect.bottom - navRect.top + 2;

        indicator.style.width = `${width}px`;
        indicator.style.transform = `translate(${left}px, ${top}px)`;
        indicator.style.opacity = "1";
    };

    const moveToActive = () => {
        const activeTab = nav.querySelector<HTMLElement>(".nav-tab.active");

        if (activeTab) {
            moveIndicator(activeTab);
        } else {
            indicator.style.opacity = "0";
            indicator.style.width = "0px";
        }
    };

    links.forEach((link) => {
        const onEnter = () => moveIndicator(link);
        const onLeave = () => moveToActive();

        link.addEventListener("mouseenter", onEnter);
        link.addEventListener("mouseleave", onLeave);

        cleanup.push(() => link.removeEventListener("mouseenter", onEnter));
        cleanup.push(() => link.removeEventListener("mouseleave", onLeave));
    });

    const onLeave = () => moveToActive();
    nav.addEventListener("mouseleave", onLeave);
    cleanup.push(() => nav.removeEventListener("mouseleave", onLeave));

    const onResize = () => moveToActive();
    window.addEventListener("resize", onResize);
    cleanup.push(() => window.removeEventListener("resize", onResize));

    moveToActive();

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


const year = new Date().getFullYear()
</script>

<template>

    <div class="d-flex align-items-center">
        <RouterLink class="nav-link" to="/" active-class="active">
            <img src="../assets/GameVoyagerLogo.png" width="120" height="120" alt="Logo" class="me-3">
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
                                Discover
                            </RouterLink>
                        </li>

                        <li>
                            <RouterLink
                                class="nav-link nav-item-link nav-tab d-flex justify-content-center justify-content-lg-start"
                                to="/browse" active-class="active">
                                Browse
                            </RouterLink>
                        </li>

                        <li class="nav-item d-lg-none">
                            <RouterLink
                                class="nav-link nav-item-link d-flex justify-content-center justify-content-lg-start"
                                to="/cart" active-class="active">Cart
                            </RouterLink>
                        </li>

                        <li class="nav-item d-lg-none">
                            <RouterLink
                                class="nav-link nav-item-link d-flex justify-content-center justify-content-lg-start"
                                to="/login" active-class="active">Login
                            </RouterLink>
                        </li>

                        <span class="nav-indicator"></span>
                    </ul>

                    <div class="glow-link mx-3">
                        <RouterLink class="nav-link d-flex align-items-center gap-2 p-0 d-none d-lg-inline" to="/cart">
                            <span class="position-relative d-inline-block">
                                <i class="fa-solid fa-cart-shopping fs-4 "></i>


                                <span
                                    class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger d-none d-lg-inline"
                                    style="font-size: 0.65rem;">
                                    1
                                </span>
                            </span>

                            <span class="fw-semibold d-none d-lg-inline">€5.74</span>

                        </RouterLink>
                    </div>

                    <RouterLink class="nav-link d-none d-lg-inline" to="/login" active-class="active">
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

/* hover animation */


.nav-link:hover {
    color: #7C5CFF;
}
</style>