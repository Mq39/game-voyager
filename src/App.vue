<script setup lang="ts">
import { onMounted } from "vue"
import { useAuth } from "@/composable/useAuth"

const { restoreAuth } = useAuth()

onMounted(() => {
  restoreAuth()
})
</script>

<template>
  <div class="stars"></div>
  <div class="particles"></div>
  <RouterView />
</template>

<style>
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
