import { renderHook } from "@testing-library/react";
import useMeasureText from "../use-measure-text";

describe("useMeasureText", () => {
  let measureTextMock: jest.MockedFunction<(text: string) => TextMetrics>;

  beforeEach(() => {
    measureTextMock = jest.fn() as jest.MockedFunction<(text: string) => TextMetrics>;
    const context = {
      measureText: measureTextMock,
    } as unknown as CanvasRenderingContext2D;
    jest.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(context);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe("estimateWidth", () => {
    test("should estimate width", () => {
      measureTextMock.mockReturnValue({ width: 150 } as TextMetrics);
      const { result } = renderHook(() => useMeasureText("13px", "font"));

      expect(result.current.estimateWidth(2)).toBe(300);
    });
  });

  describe("measureText", () => {
    test("should measure width", () => {
      measureTextMock.mockReturnValue({ width: 150 } as TextMetrics);
      const { result } = renderHook(() => useMeasureText("13px", "font"));

      expect(result.current.measureText("some string")).toBe(175);
    });
  });
});
