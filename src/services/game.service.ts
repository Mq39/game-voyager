import type { Game } from "@/models/game.model"
import axios from "axios"

const API_BASE_URL = "http://localhost:4000"

type BrowseGamesParams = {
    search?: string
    genre?: string
    platform?: string
    ordering?: string
    page?: number
    pageSize?: number
}

type BrowseGamesResponse = {
    results: Game[]
}



export const browseGames = async (
    params: BrowseGamesParams
): Promise<BrowseGamesResponse> => {
    const response = await axios.get<BrowseGamesResponse>(
        "http://localhost:4000/api/games/browse",
        { params }
    )

    return response.data
}


export const searchGames = async (
    query: string,
    pageSize = 6
): Promise<Game[]> => {
    const response = await axios.get<Game[]>(
        "http://localhost:4000/api/games/search",
        {
            params: {
                query,
                pageSize
            }
        }
    )

    return response.data
}

export const getRandomGame = async (): Promise<{ id: number; title: string }> => {
    const response = await axios.get("http://localhost:4000/api/games/random")
    return response.data
}