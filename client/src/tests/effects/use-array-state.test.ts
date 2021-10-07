import { act, renderHook } from "@testing-library/react-hooks"
import { useArrayState } from "../../effects/use-array-state"

describe('useArrayState hook', () => {
  it("returns initial value", () => {
    const initialValue = [1]

    const { result: { current: [value] } } = renderHook(() => useArrayState(initialValue))
    expect(value).toEqual(initialValue)
  })

  it("adds value", () => {
    const newValue = 2

    const { result } = renderHook(() => useArrayState())

    act(() => {
      result.current[2](newValue)
    })

    expect(result.current[0]).toEqual([newValue])
  })

  it("resets value", () => {
    const { result } = renderHook(() => useArrayState([1]))

    expect(result.current[0]).not.toEqual(undefined)

    act(() => {
      result.current[3]()
    })

    expect(result.current[0]).toEqual(undefined)
  })

  it("sets value", () => {
    const newValue = [3]
    const { result } = renderHook(() => useArrayState<number>())

    expect(result.current[0]).not.toEqual(newValue)

    act(() => {
      result.current[1](newValue)
    })

    expect(result.current[0]).toEqual(newValue)
  })
})
