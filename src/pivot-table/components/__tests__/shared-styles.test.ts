import { borderBottomRightStyle, borderBottomStyle, cellStyle, getBorderStyle } from "../shared-styles";

const borderColor = "red";

describe("Shared styles", () => {
  describe("getBorderStyle", () => {
    test("should resolve style for last row and last column", () => {
      expect(getBorderStyle(true, true, borderColor, false)).toBe(cellStyle);
    });

    test("should resolve style for last row", () => {
      expect(getBorderStyle(true, false, borderColor, true)).toEqual({ ...borderBottomRightStyle, borderColor });
    });

    test("should resolve style for last column", () => {
      expect(getBorderStyle(false, true, borderColor, false)).toEqual({ ...borderBottomStyle, borderColor });
    });

    test("should resolve style cell that is not last row or column", () => {
      expect(getBorderStyle(false, false, borderColor, false)).toEqual({ ...borderBottomRightStyle, borderColor });
    });
  });
});
