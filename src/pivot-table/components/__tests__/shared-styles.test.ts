import type { ShowLastBorder } from "../../../types/types";
import { borderStyle, cellStyle, getBorderStyle } from "../shared-styles";

describe("Shared styles", () => {
  describe("getBorderStyle", () => {
    const borderColor = "red";
    const baseStyle = {
      ...cellStyle,
      ...borderStyle,
      borderWidth: 0,
      borderRightColor: undefined,
      borderBottomColor: undefined,
    };
    const noBorder = { ...baseStyle, borderRightWidth: 0, borderBottomWidth: 0 };
    const borderRight = {
      ...baseStyle,
      borderRightWidth: 1,
      borderBottomWidth: 0,
      borderRightColor: borderColor,
      borderBottomColor: undefined,
    };
    const borderBottom = {
      ...baseStyle,
      borderRightWidth: 0,
      borderBottomWidth: 1,
      borderRightColor: undefined,
      borderBottomColor: borderColor,
    };
    const borderRightBottom = {
      ...baseStyle,
      borderRightWidth: 1,
      borderBottomWidth: 1,
      borderRightColor: borderColor,
      borderBottomColor: borderColor,
    };
    let showLastBorder: ShowLastBorder;

    beforeEach(() => {
      showLastBorder = { right: false, bottom: false };
    });

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
});
