import axios from "axios"
import type {
    BrowseGamesParams,
    BrowseGamesResponse,
    RandomGame
} from "@/models/game.model"

const API_BASE_URL = "https://game-voyager-backend.vercel.app/"

export const browseGames = async (
    params: BrowseGamesParams
): Promise<BrowseGamesResponse> => {
    const response = await axios.get(`${API_BASE_URL}/api/games/browse`, {
        params
    })

    console.log("browseGames response:", response.data)

    return {
        results: Array.isArray(response.data?.results) ? response.data.results : []
    }
}

export const searchGames = async (
    query: string,
    pageSize = 6
): Promise<BrowseGamesResponse> => {
    const response = await axios.get(`${API_BASE_URL}/api/games/search`, {
        params: { query, pageSize }
    })

    console.log("searchGames response:", response.data)

    return {
        results: Array.isArray(response.data?.results) ? response.data.results : []
    }
}

export const getRandomGame = async (): Promise<RandomGame> => {
    const response = await axios.get(`${API_BASE_URL}/api/games/random`)
    return response.data
}