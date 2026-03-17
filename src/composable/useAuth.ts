import { computed, ref } from "vue"
import type { AuthUser, AuthResponse } from "@/models/auth.model"
import { getStoredUser, logoutUser as clearStoredAuth, saveAuth as persistAuth, getToken } from "@/services/authentication.service"

const user = ref<AuthUser | null>(getStoredUser())
const token = ref<string | null>(getToken())

export const useAuth = () => {
    const isAuthenticated = computed(() => !!token.value && !!user.value)

    const setAuth = (data: AuthResponse): void => {
        persistAuth(data)
        token.value = data.token
        user.value = data.user
    }

    const logout = (): void => {
        clearStoredAuth()
        token.value = null
        user.value = null
    }

    const restoreAuth = (): void => {
        token.value = getToken()
        user.value = getStoredUser()
    }

    return {
        user,
        token,
        isAuthenticated,
        setAuth,
        logout,
        restoreAuth
    }
}