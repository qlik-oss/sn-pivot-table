import {
  borderBottomRightStyle,
  borderBottomStyle,
  borderRightStyle,
  cellStyle,
  getBorderStyle,
} from "../shared-styles";

describe("Shared styles", () => {
  describe("getBorderStyle", () => {
    test("should resolve style for last row and last column", () => {
      expect(getBorderStyle(true, true)).toBe(cellStyle);
    });

    test("should resolve style for last row", () => {
      expect(getBorderStyle(true, false)).toBe(borderRightStyle);
    });

    test("should resolve style for last column", () => {
      expect(getBorderStyle(false, true)).toBe(borderBottomStyle);
    });

    test("should resolve style cell that is not last row or column", () => {
      expect(getBorderStyle(false, false)).toBe(borderBottomRightStyle);
    });
  });
});
