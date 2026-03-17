import axios from "axios"
import type { LoginPayload, RegisterPayload, AuthUser, AuthResponse } from "@/models/auth.model"

const API_BASE_URL = "https://game-voyager-backend.vercel.app/api/auth"

export const loginUser = async (payload: LoginPayload): Promise<AuthResponse> => {
    const response = await axios.post(`${API_BASE_URL}/login`, payload)
    return response.data
}

export const registerUser = async (
    payload: RegisterPayload
): Promise<AuthResponse> => {
    const response = await axios.post(`${API_BASE_URL}/register`, payload)
    return response.data
}

export const saveAuth = (data: AuthResponse): void => {
    localStorage.setItem("gv_token", data.token)
    localStorage.setItem("gv_user", JSON.stringify(data.user))
}

export const getStoredUser = (): AuthUser | null => {
    const raw = localStorage.getItem("gv_user")
    if (!raw) return null

    try {
        return JSON.parse(raw) as AuthUser
    } catch {
        return null
    }
}

export const logoutUser = (): void => {
    localStorage.removeItem("gv_token")
    localStorage.removeItem("gv_user")
}

export const getToken = (): string | null => {
    return localStorage.getItem("gv_token")
}