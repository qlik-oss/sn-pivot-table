import { renderHook, waitFor } from "@testing-library/react";
import type { StyleService } from "../../types/types";
import useFonts from "../use-fonts";

describe("useFonts", () => {
  let styleService: StyleService;

  beforeEach(() => {
    styleService = {
      header: {
        fontStyle: "Header-FontStyle",
        fontWeight: "Header-FontWeight",
        fontSize: "Header-FontSize",
        fontFamily: "Header-FontFamily",
      },
      dimensionValue: {
        fontStyle: "DimensionValue-FontStyle",
        fontWeight: "DimensionValue-FontWeight",
        fontSize: "DimensionValue-FontSize",
        fontFamily: "DimensionValue-FontFamily",
      },
      measureValue: {
        fontStyle: "MeasureValue-FontStyle",
        fontWeight: "MeasureValue-FontWeight",
        fontSize: "MeasureValue-FontSize",
        fontFamily: "MeasureValue-FontFamily",
      },
      measureLabel: {
        fontStyle: "MeasureLabel-FontStyle",
        fontWeight: "MeasureLabel-FontWeight",
      },
      nullValue: {
        fontStyle: "NullValue-FontStyle",
        fontWeight: "NullValue-FontWeight",
      },
      totalValue: {
        fontStyle: "TotalValue-FontStyle",
        fontWeight: "TotalValue-FontWeight",
      },
    } as StyleService;
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  test("should return all possible fonts", async () => {
    const { result } = renderHook(() => useFonts(styleService));

    await waitFor(() => {
      const fonts = result.current;

      expect(fonts).toEqual([
        "Header-FontStyle Header-FontWeight Header-FontSize Header-FontFamily",
        "DimensionValue-FontStyle DimensionValue-FontWeight DimensionValue-FontSize DimensionValue-FontFamily",
        "MeasureLabel-FontStyle MeasureLabel-FontWeight DimensionValue-FontSize DimensionValue-FontFamily",
        "NullValue-FontStyle NullValue-FontWeight DimensionValue-FontSize DimensionValue-FontFamily",
        "TotalValue-FontStyle TotalValue-FontWeight DimensionValue-FontSize DimensionValue-FontFamily",
        "MeasureValue-FontStyle MeasureValue-FontWeight MeasureValue-FontSize MeasureValue-FontFamily",
        "NullValue-FontStyle NullValue-FontWeight MeasureValue-FontSize MeasureValue-FontFamily",
        "TotalValue-FontStyle TotalValue-FontWeight MeasureValue-FontSize MeasureValue-FontFamily",
      ]);
    });
  });

  test("should return all unique fonts", async () => {
    const sharedStyle = {
      fontStyle: "italic",
      fontWeight: "600",
    };
    styleService = {
      header: {
        ...sharedStyle,
        fontSize: "Header-FontSize",
        fontFamily: "Header-FontFamily",
      },
      dimensionValue: {
        ...sharedStyle,
        fontSize: "DimensionValue-FontSize",
        fontFamily: "DimensionValue-FontFamily",
      },
      measureValue: {
        ...sharedStyle,
        fontSize: "MeasureValue-FontSize",
        fontFamily: "MeasureValue-FontFamily",
      },
      measureLabel: sharedStyle,
      nullValue: sharedStyle,
      totalValue: sharedStyle,
    } as StyleService;
    const { result } = renderHook(() => useFonts(styleService));

    await waitFor(() => {
      const fonts = result.current;

      expect(fonts).toEqual([
        "italic 600 Header-FontSize Header-FontFamily",
        "italic 600 DimensionValue-FontSize DimensionValue-FontFamily",
        "italic 600 MeasureValue-FontSize MeasureValue-FontFamily",
      ]);
    });
  });

  test("should handle when font weight is undefined", async () => {
    const sharedStyle = {
      fontStyle: "italic",
      fontWeight: undefined,
    };
    styleService = {
      header: {
        ...sharedStyle,
        fontSize: "Header-FontSize",
        fontFamily: "Header-FontFamily",
      },
      dimensionValue: {
        ...sharedStyle,
        fontSize: "DimensionValue-FontSize",
        fontFamily: "DimensionValue-FontFamily",
      },
      measureValue: {
        ...sharedStyle,
        fontSize: "MeasureValue-FontSize",
        fontFamily: "MeasureValue-FontFamily",
      },
      measureLabel: sharedStyle,
      nullValue: sharedStyle,
      totalValue: sharedStyle,
    } as StyleService;
    const { result } = renderHook(() => useFonts(styleService));

    await waitFor(() => {
      const fonts = result.current;

      expect(fonts).toEqual([
        "italic Header-FontSize Header-FontFamily",
        "italic DimensionValue-FontSize DimensionValue-FontFamily",
        "italic MeasureValue-FontSize MeasureValue-FontFamily",
      ]);
    });
  });
});
