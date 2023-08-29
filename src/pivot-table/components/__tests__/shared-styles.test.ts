import {
  borderBottomRightStyle,
  borderBottomStyle,
  borderRightStyle,
  cellStyle,
  getBorderStyle,
} from "../shared-styles";

const borderColor = "red";

describe("Shared styles", () => {
  describe("getBorderStyle", () => {
    test("should resolve style for last row and last column while `showLastRowBorderBottom` is true", () => {
      expect(getBorderStyle(true, true, borderColor, true)).toEqual({
        ...borderBottomStyle,
        borderBottomColor: borderColor,
      });
    });

    test("should resolve style for last row and last column", () => {
      expect(getBorderStyle(true, true, borderColor, false)).toBe(cellStyle);
    });

    test("should resolve style for last row while `showLastRowBorderBottom` is true", () => {
      expect(getBorderStyle(true, false, borderColor, true)).toEqual({
        ...borderBottomRightStyle,
        borderBottomColor: borderColor,
        borderRightColor: borderColor,
      });
    });

    test("should resolve style for last row", () => {
      expect(getBorderStyle(true, false, borderColor, false)).toEqual({
        ...borderRightStyle,
        borderRightColor: borderColor,
      });
    });

    test("should resolve style for last column", () => {
      expect(getBorderStyle(false, true, borderColor, false)).toEqual({
        ...borderBottomStyle,
        borderBottomColor: borderColor,
      });
    });

    test("should resolve style cell that is not last row or column", () => {
      expect(getBorderStyle(false, false, borderColor, false)).toEqual({
        ...borderBottomRightStyle,
        borderBottomColor: borderColor,
        borderRightColor: borderColor,
      });
    });
  });
});
