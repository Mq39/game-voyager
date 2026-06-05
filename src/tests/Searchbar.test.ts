import { mount, flushPromises } from "@vue/test-utils"
import { describe, it, expect, vi, beforeEach } from "vitest"
import SearchBar from "../components/reusables/SearchBar.vue"
import { searchGames } from "../services/game.service"

vi.mock("vue-router", () => ({
    useRoute: () => ({
        query: {}
    }),
    useRouter: () => ({
        push: vi.fn()
    })
}))

vi.mock("../services/game.service", () => ({
    searchGames: vi.fn()
}))

describe("SearchBar.vue", () => {
    beforeEach(() => {
        vi.clearAllMocks()
        vi.useFakeTimers()
    })

    it("renderuje search input", () => {
        const wrapper = mount(SearchBar)

        const input = wrapper.find("input")

        expect(input.exists()).toBe(true)
        expect(input.attributes("placeholder")).toBe("Search games...")
    })

    it("prikazuje sugestije nakon unosa pojma", async () => {
        vi.mocked(searchGames).mockResolvedValue([
            {
                id: 1,
                title: "Elden Ring",
                image: ""
            }
        ] as any)

        const wrapper = mount(SearchBar)

        await wrapper.find("input").setValue("elden")

        await vi.advanceTimersByTimeAsync(350)
        await flushPromises()

        expect(searchGames).toHaveBeenCalledWith("elden", 6)
        expect(wrapper.text()).toContain("Elden Ring")
    })
})