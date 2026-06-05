import { mount } from "@vue/test-utils"
import { describe, it, expect } from "vitest"
import Home from "../views/Home.vue"

describe("Home.vue", () => {
    it("renderuje Home stranicu i promo kartice", () => {
        const wrapper = mount(Home, {
            global: {
                stubs: {
                    MainLayout: {
                        template: "<div><slot /></div>"
                    },
                    Hero: true,
                    PopularGamesList: true,
                    RouterLink: {
                        props: ["to"],
                        template: "<a><slot /></a>"
                    }
                }
            }
        })

        expect(wrapper.exists()).toBe(true)
        expect(wrapper.text()).toContain("Most Popular")
        expect(wrapper.text()).toContain("Highest rated")
        expect(wrapper.text()).toContain("New Releases")
    })
})