import axios from "axios"

const API_BASE_URL = "http://localhost:4000/api"

export type LoginPayload = {
    username: string
    password: string
}

export type RegisterPayload = {
    username: string
    email: string
    password: string
}

export type AuthUser = {
    id: number
    username: string
    email: string
}

export type AuthResponse = {
    token: string
    user: AuthUser
}

export const loginUser = async (payload: LoginPayload): Promise<AuthResponse> => {
    const response = await axios.post(`${API_BASE_URL}/auth/login`, payload)
    return response.data
}

export const registerUser = async (payload: RegisterPayload): Promise<AuthResponse> => {
    const response = await axios.post(`${API_BASE_URL}/auth/register`, payload)
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