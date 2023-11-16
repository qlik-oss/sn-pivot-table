import type { HeaderCell, ShowLastBorder } from "../../../types/types";
import { borderStyle, getBorderStyle, getHeaderBorderStyle } from "../shared-styles";

describe("Shared styles", () => {
  const borderColor = "red";
  let showLastBorder: ShowLastBorder;

  beforeEach(() => {
    showLastBorder = { right: false, bottom: false };
  });

  const baseStyle = {
    ...borderStyle,
    borderWidth: 0,
    borderRightColor: undefined,
    borderBottomColor: undefined,
  };

  describe("getBorderStyle", () => {
    const noBorder = { ...baseStyle, borderRightWidth: 0, borderBottomWidth: 0 };
    const borderRight = {
      ...baseStyle,
      borderRightWidth: 1,
      borderBottomWidth: 0,
      borderRightColor: borderColor,
    };
    const borderBottom = {
      ...baseStyle,
      borderRightWidth: 0,
      borderBottomWidth: 1,
      borderBottomColor: borderColor,
    };
    const borderRightBottom = {
      ...baseStyle,
      borderRightWidth: 1,
      borderBottomWidth: 1,
      borderRightColor: borderColor,
      borderBottomColor: borderColor,
    };

    // last row and bottom
    test("should resolve style for last row and last column", () => {
      expect(getBorderStyle(true, true, borderColor, showLastBorder)).toEqual(noBorder);
    });

    test("should resolve style for last row and last column while `showLastBorder.right` is true", () => {
      showLastBorder.right = true;
      expect(getBorderStyle(true, true, borderColor, showLastBorder)).toEqual(borderRight);
    });

    test("should resolve style for last row and last column while `showLastBorder.bottom` is true", () => {
      showLastBorder.bottom = true;
      expect(getBorderStyle(true, true, borderColor, showLastBorder)).toEqual(borderBottom);
    });

    test("should resolve style for last row and last column while `showLastBorder.right` and `showLastBorder.bottom` are true", () => {
      showLastBorder = { right: true, bottom: true };
      expect(getBorderStyle(true, true, borderColor, showLastBorder)).toEqual(borderRightBottom);
    });

    // last row
    test("should resolve style for last row while `showLastBorder.bottom` is true", () => {
      showLastBorder.bottom = true;
      expect(getBorderStyle(true, false, borderColor, showLastBorder)).toEqual(borderRightBottom);
    });

    test("should resolve style for last row", () => {
      expect(getBorderStyle(true, false, borderColor, showLastBorder)).toEqual(borderRight);
    });

    // last column
    test("should resolve style for last column while `showLastBorder.right` is true", () => {
      showLastBorder.right = true;
      expect(getBorderStyle(false, true, borderColor, showLastBorder)).toEqual(borderRightBottom);
    });

    test("should resolve style for last column", () => {
      expect(getBorderStyle(false, true, borderColor, showLastBorder)).toEqual(borderBottom);
    });

    // not last row or column
    test("should resolve style cell that is not last row or column", () => {
      expect(getBorderStyle(false, false, borderColor, showLastBorder)).toEqual(borderRightBottom);
    });
  });

  describe("getHeaderBorderStyle", () => {
    let cell: HeaderCell;

    const borderLeft = {
      ...baseStyle,
      borderBottomWidth: 0,
      borderLeftWidth: 1,
      borderLeftColor: borderColor,
      borderRightWidth: 0,
      borderRightColor: undefined,
    };

    const borderLeftBottom = {
      ...baseStyle,
      borderLeftWidth: 1,
      borderLeftColor: borderColor,
      borderRightWidth: 0,
      borderRightColor: undefined,
      borderBottomWidth: 1,
      borderBottomColor: borderColor,
    };

    const borderLeftDoubleBottom = {
      ...baseStyle,
      borderLeftWidth: 1,
      borderLeftColor: borderColor,
      borderRightWidth: 0,
      borderRightColor: undefined,
      borderBottomWidth: 2,
      borderBottomColor: borderColor,
    };

    const borderRight = {
      ...baseStyle,
      borderLeftWidth: 0,
      borderRightWidth: 1,
      borderRightColor: borderColor,
      borderBottomWidth: 0,
    };

    const borderRightBottom = {
      ...baseStyle,
      borderLeftWidth: 0,
      borderRightWidth: 1,
      borderRightColor: borderColor,
      borderBottomWidth: 1,
      borderBottomColor: borderColor,
    };

    const borderRightDoubleBottom = {
      ...baseStyle,
      borderLeftWidth: 0,
      borderRightWidth: 1,
      borderRightColor: borderColor,
      borderBottomWidth: 2,
      borderBottomColor: borderColor,
    };

    beforeEach(() => {
      cell = {} as unknown as HeaderCell;
    });

    describe("top dimensions", () => {
      beforeEach(() => {
        cell.isLeftDimension = false;
      });

      test("should resolve last column style for top dimension", () => {
        cell.isLastDimension = false;
        expect(getHeaderBorderStyle(cell, false, false, true, borderColor, showLastBorder)).toEqual(borderLeftBottom);
      });

      test("should resolve last column style for last top dimension", () => {
        cell.isLastDimension = true;
        expect(getHeaderBorderStyle(cell, false, false, true, borderColor, showLastBorder)).toEqual(
          borderLeftDoubleBottom,
        );
      });

      test("should resolve last column style for last top dimension at last row", () => {
        cell.isLastDimension = true;
        expect(getHeaderBorderStyle(cell, true, false, true, borderColor, showLastBorder)).toEqual(borderLeft);
      });

      test("should resolve first column style for top dimension", () => {
        cell.isLastDimension = false;
        expect(getHeaderBorderStyle(cell, false, true, false, borderColor, showLastBorder)).toEqual(borderRightBottom);
      });

      test("should resolve first column style column for last top dimension", () => {
        cell.isLastDimension = true;
        expect(getHeaderBorderStyle(cell, false, true, false, borderColor, showLastBorder)).toEqual(
          borderRightDoubleBottom,
        );
      });

      test("should resolve first column style column for last top dimension at last row", () => {
        cell.isLastDimension = true;
        expect(getHeaderBorderStyle(cell, true, true, false, borderColor, showLastBorder)).toEqual(borderRight);
      });
    });
  });
});
