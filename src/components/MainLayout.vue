<script lang="ts" setup>
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
                    <ul class="navbar-nav p-0 me-auto mb-2 mb-lg-0">
                        <li class="nav-item">

                        </li>
                        <li class="nav-item">
                            <RouterLink class="nav-link" to="/discover" active-class="active">
                                Discover
                            </RouterLink>
                        </li>
                        <li class="nav-item">
                            <RouterLink class="nav-link" to="/browse" active-class="active">
                                Browse
                            </RouterLink>
                        </li>
                    </ul>
                    <div class="navbar-text">
                        Ime Korisnika
                    </div>
                </div>
            </div>
        </nav>

    </div>
    <slot></slot>
    <footer class="mt-3 text-center">&copy; {{ year }} - GameVoyager</footer>
</template>