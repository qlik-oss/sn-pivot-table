import { borderStyle, cellStyle, getBorderStyle } from "../shared-styles";

describe("Shared styles", () => {
  describe("getBorderStyle", () => {
    const borderColor = "red";
    const baseStyle = { ...cellStyle, ...borderStyle, borderColor, borderWidth: 0 };
    const noBorder = { ...baseStyle, borderRightWidth: 0, borderBottomWidth: 0 };
    const borderRight = { ...baseStyle, borderRightWidth: 1, borderBottomWidth: 0 };
    const borderBottom = { ...baseStyle, borderRightWidth: 0, borderBottomWidth: 1 };
    const borderRightBottom = { ...baseStyle, borderRightWidth: 1, borderBottomWidth: 1 };

    test("should resolve style for last row and last column while `showLastRowBorderBottom` is true", () => {
      expect(getBorderStyle(true, true, borderColor, true)).toEqual(borderBottom);
    });

    test("should resolve style for last row and last column", () => {
      expect(getBorderStyle(true, true, borderColor, false)).toEqual(noBorder);
    });

    test("should resolve style for last row while `showLastRowBorderBottom` is true", () => {
      expect(getBorderStyle(true, false, borderColor, true)).toEqual(borderRightBottom);
    });

    test("should resolve style for last row", () => {
      expect(getBorderStyle(true, false, borderColor, false)).toEqual(borderRight);
    });

    test("should resolve style for last column", () => {
      expect(getBorderStyle(false, true, borderColor, false)).toEqual(borderBottom);
    });

    test("should resolve style cell that is not last row or column", () => {
      expect(getBorderStyle(false, false, borderColor, false)).toEqual(borderRightBottom);
    });
  });
});
