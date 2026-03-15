<script setup lang="ts">
import { ref } from "vue"
import { useRouter } from "vue-router"
import MainLayout from "@/components/layout/MainLayout.vue"
import { registerUser, saveAuth } from "@/services/authentication.service"
import { useAuth } from "@/composable/useAuthentication"

const router = useRouter()

const username = ref("")
const email = ref("")
const password = ref("")
const confirmPassword = ref("")
const loading = ref(false)
const error = ref("")
const { setAuth } = useAuth()

const handleRegister = async (): Promise<void> => {
    if (password.value !== confirmPassword.value) {
        error.value = "Passwords do not match."
        return
    }

    try {
        loading.value = true
        error.value = ""

        const data = await registerUser({
            username: username.value,
            email: email.value,
            password: password.value
        })

        setAuth(data)
        await router.push("/")
    } catch (err) {
        console.error("Registration failed:", err)
        error.value = "Failed to create account."
    } finally {
        loading.value = false
    }
}
</script>

<template>
    <MainLayout>
        <section class="container py-5 auth-page">
            <div class="auth-card mx-auto">
                <h1 class="auth-title">Register</h1>
                <p class="auth-subtitle">Create your GameVoyager account.</p>

                <form @submit.prevent="handleRegister">
                    <div class="mb-3">
                        <label class="form-label">Username</label>
                        <input v-model="username" type="text" class="form-control auth-input" required />
                    </div>

                    <div class="mb-3">
                        <label class="form-label">Email</label>
                        <input v-model="email" type="email" class="form-control auth-input" required />
                    </div>

                    <div class="mb-3">
                        <label class="form-label">Password</label>
                        <input v-model="password" type="password" class="form-control auth-input" required />
                    </div>

                    <div class="mb-3">
                        <label class="form-label">Confirm Password</label>
                        <input v-model="confirmPassword" type="password" class="form-control auth-input" required />
                    </div>

                    <p v-if="error" class="auth-error">{{ error }}</p>

                    <button type="submit" class="auth-button" :disabled="loading">
                        {{ loading ? "Creating account..." : "Register" }}
                    </button>
                </form>
                <div>
                    Already have an account?
                    <RouterLink to="/login">Log in</RouterLink>
                </div>
            </div>
        </section>
    </MainLayout>
</template>

<style scoped>
.auth-page {
    color: white;
}

.auth-card {
    max-width: 460px;
    padding: 2rem;
    border-radius: 20px;
    background: rgba(255, 255, 255, 0.04);
    border: 1px solid rgba(255, 255, 255, 0.08);
}

.auth-title {
    font-size: 2rem;
    font-weight: 800;
    margin-bottom: 0.35rem;
}

.auth-subtitle {
    color: rgba(255, 255, 255, 0.65);
    margin-bottom: 1.5rem;
}

.auth-input {
    background: rgba(255, 255, 255, 0.06);
    border: 1px solid rgba(255, 255, 255, 0.08);
    color: white;
}

.auth-input:focus {
    background: rgba(255, 255, 255, 0.08);
    color: white;
    border-color: rgba(124, 92, 255, 0.65);
    box-shadow: 0 0 0 0.2rem rgba(124, 92, 255, 0.12);
}

.auth-error {
    color: #ff6e6e;
    margin-bottom: 1rem;
}

.auth-button {
    width: 100%;
    min-height: 46px;
    border: none;
    border-radius: 999px;
    color: white;
    background: rgba(124, 92, 255, 0.35);
    font-weight: 700;
}
</style>