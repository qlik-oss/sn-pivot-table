import type { HeaderCell, ShowLastBorder } from "../../../types/types";
import { BorderStyle, getBorderStyle, getHeaderBorderStyle } from "../shared-styles";

describe("Shared styles", () => {
  let showLastBorder: ShowLastBorder;

  const borderColor = "red";

  const singleBorder = `1px ${BorderStyle.Solid} ${borderColor}`;

  const noBorders = {
    borderRight: BorderStyle.None,
    borderBottom: BorderStyle.None,
    borderLeft: BorderStyle.None,
    borderTop: BorderStyle.None,
  };

  const borderRight = {
    ...noBorders,
    borderRight: singleBorder,
  };
  const borderBottom = {
    ...noBorders,
    borderBottom: singleBorder,
  };
  const borderRightBottom = {
    ...noBorders,
    borderRight: singleBorder,
    borderBottom: singleBorder,
  };

  beforeEach(() => {
    showLastBorder = { right: false, bottom: false };
  });

  describe("getBorderStyle", () => {
    // last row and bottom
    test("should resolve style for last row and last column", () => {
      expect(getBorderStyle(true, true, borderColor, showLastBorder)).toEqual(noBorders);
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

    const doubleBorder = `2px ${BorderStyle.Solid} ${borderColor}`;

    const borderLeft = {
      ...noBorders,
      borderLeft: singleBorder,
    };

    const borderLeftBottom = {
      ...noBorders,
      borderLeft: singleBorder,
      borderBottom: singleBorder,
    };

    const borderLeftDoubleBottom = {
      ...noBorders,
      borderLeft: singleBorder,
      borderBottom: doubleBorder,
    };

    const borderRightDoubleBottom = {
      ...noBorders,
      borderRight: singleBorder,
      borderBottom: doubleBorder,
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
