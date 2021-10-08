import { act, renderHook } from "@testing-library/react-hooks"
import * as useRequest from "../../effects/use-request"
import { useUser } from "../../effects/use-user"
import { userMock } from "../tests-utils"

jest.mock("../../effects/use-request")

describe('useUser hook', () => {
  const startSpy = jest.fn()
  const useRequestDefault = { data: undefined, start: startSpy, resetData: jest.fn(), isLoading: false }
  const useRequestMock = jest.spyOn(useRequest, "useRequest").mockReturnValue(useRequestDefault)

  it("sends request to the server", () => {
    renderHook(() => useUser())
    expect(startSpy).toBeCalled()
  })

  it("signs out the user", async () => {
    const { result } = renderHook(() => useUser())
    
    act(() => {
      result.current.handleSignOut()
    })

    expect(result.current.user).toEqual(null)
  })

  describe('and user is unauthenticated', () => {
    beforeAll(() => {
      useRequestMock.mockReturnValue({ ...useRequestDefault, data: { statusCode: 1 } })
    })

    it("sets user as null", () => {
      const { result } = renderHook(() => useUser())

      expect(result.current.user).toEqual(null)
    })
  })

  describe('and user is authenticated', () => {
    const user = userMock

    beforeAll(() => {
      useRequestMock.mockReturnValue({ ...useRequestDefault, data: user })
    })

    it("sets user as null", () => {
      const { result } = renderHook(() => useUser())

      expect(result.current.user).toEqual(user)
    })
  })
})
