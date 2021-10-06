import { act, renderHook } from "@testing-library/react-hooks"
import * as useRequest from "../../effects/use-request"
import { useUser } from "../../effects/use-user"

jest.mock("../../effects/use-request")

describe('useUser hook', () => {
  const startSpy = jest.fn()
  jest.spyOn(useRequest, "useRequest").mockReturnValue({ data: undefined, start: startSpy, resetData: jest.fn(), isLoading: false })

  it("sends request to the server", () => {
    renderHook(() => useUser())
    expect(startSpy).toBeCalled()
  })

  it("signs out the user", async () => {
    const { result: { current: { user, handleSignOut } } } = renderHook(() => useUser())
    
    act(() => {
      handleSignOut()
    })

    setTimeout(() => {
      expect(user).toEqual(null)
    })
  })
})
