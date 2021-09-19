import { getCookieParams } from "./utils"

describe("Utils", () => {
  describe("getCookieParams function", () => {
    const key = "key"
    const value = "value"

    it("returns object with cookie value", () => {
      expect(getCookieParams(`${key}=${value}`)).toHaveProperty(key, value)
    })

    it("handles cookie with multiple keys", () => {
      const key2 = "key2"
      const value2 = "value2"
      const cookie = getCookieParams(`${key}=${value}; ${key2}=${value2}`)

      expect(cookie).toHaveProperty(key, value)
      expect(cookie).toHaveProperty(key2, value2)
    })

    it("handles empty values", () => {
      const key2 = "key2"
      const cookie = getCookieParams(`${key}=${value}; ${key2}`)

      expect(cookie).toHaveProperty(key2)
      expect(cookie).toHaveProperty(key, value)
    })
  })
})
