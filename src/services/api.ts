import axios from "axios"
import { getToken } from "./authentication.service"

export const api = axios.create({
    baseURL: "https://game-voyager-backend.vercel.app/"
})

api.interceptors.request.use((config) => {
    const token = getToken()

    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }

    return config
})