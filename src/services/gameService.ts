import type { Game } from "@/models/game.model"
import axios from "axios"

export const searchGames = async (
    query: string,
    pageSize = 6
): Promise<Game[]> => {
    const response = await axios.get<Game[]>(
        "https://game-voyager-backend.vercel.app/api/games/search",
        {
            params: {
                query,
                pageSize
            }
        }
    )

    return response.data
}