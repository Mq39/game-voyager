<script lang="ts" setup>
const year = new Date().getFullYear()
</script>

<template>
    <div class="stars"></div>
    <div class="particles"></div>
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
                    <ul class="navbar-nav p-0 me-auto mb-2 mb-lg-0">
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
                    </ul>

                    <div class="glow-link mx-3">
                        <RouterLink class="nav-link d-flex align-items-center gap-2 p-0" to="/cart">
                            <span class="position-relative d-inline-block">
                                <i class="fa-solid fa-cart-shopping fs-4"></i>

                                <!-- badge -->
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
.glow-link::after {
    content: "";
    position: absolute;
    left: 0;
    bottom: -4px;

    width: 0%;
    height: 2px;

    background: #7C5CFF;
    box-shadow: 0 0 8px #7C5CFF;

    transition: width 0.3s ease;
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

body {
    background: linear-gradient(270deg,
            #0b0f1a,
            #1a2238,
            #12172a,
            #0b0f1a);

    background-size: 400% 400%;

}

@keyframes spaceGradient {
    0% {
        background-position: 0% 50%;
    }

    50% {
        background-position: 100% 50%;
    }

    100% {
        background-position: 0% 50%;
    }
}

.stars {
    position: fixed;
    width: 100%;
    height: 100%;
    background: url("https://www.transparenttextures.com/patterns/stardust.png");
    animation: starsMove 120s linear infinite;
    opacity: 0.25;
    z-index: -1;
}

@keyframes starsMove {
    from {
        background-position: 0 0;
    }

    to {
        background-position: 2000px 1000px;
    }
}
</style>