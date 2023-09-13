import { renderHook } from "@testing-library/react";
import { act } from "react-dom/test-utils";
import { useHeadCellDim } from "../use-head-cell-dim";

describe("UseHeadCellDim", () => {
  let open: boolean;

  beforeEach(() => {
    open = false;
  });

  const renderer = () => renderHook(() => useHeadCellDim({ open })).result;

  test("should return 0 if `isHovered` and `open` is false", () => {
    const result = renderer();
    expect(result.current.shadeOpacity).toBe(0);
  });

  test("should return 0.03 if `isHovered` is true", () => {
    const result = renderer();

    act(() => {
      result.current.setIsHovered(true);
    });

    expect(result.current.shadeOpacity).toBe(0.03);
  });

  test("should return 0.05 if `open` is true", () => {
    open = true;
    const result = renderer();

    expect(result.current.shadeOpacity).toBe(0.05);
  });
});
