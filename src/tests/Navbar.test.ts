import { mount } from "@vue/test-utils"
import { describe, it, expect, vi } from "vitest"
import Navbar from "../components/layout/MainLayout-components/Navbar.vue"

vi.mock("vue-router", async (importOriginal) => {
    const actual = await importOriginal<typeof import("vue-router")>()

    return {
        ...actual,

        useRoute: () => ({
            path: "/",
            name: "home",
            params: {},
            query: {}
        }),

        useRouter: () => ({
            push: vi.fn()
        }),

        createRouter: vi.fn(() => ({
            beforeEach: vi.fn(),
            afterEach: vi.fn(),
            push: vi.fn(),
            replace: vi.fn(),
            currentRoute: {
                value: {
                    path: "/"
                }
            }
        })),

        createWebHistory: vi.fn()
    }
})

describe("Navbar", () => {
    it("renderuje navbar komponentu", () => {
        const wrapper = mount(Navbar, {
            global: {
                stubs: {
                    RouterLink: true,
                    RouterView: true
                }
            }
        })

        expect(wrapper.exists()).toBe(true)
    })
})