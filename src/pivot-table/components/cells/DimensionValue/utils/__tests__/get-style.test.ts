import type { Cell, StyleService } from "../../../../../../types/types";
import { BOLD_FONT_WEIGHT } from "../../../../../constants";
import { getBackground, getColor, getCursor, getFontStyle, getFontWeight, getTextDecoration } from "../get-style";

describe("getStyle", () => {
  let cell: Cell;
  let styleService: StyleService;

  beforeEach(() => {
    cell = {
      isNull: false,
      isPseudoDimension: false,
      isEmpty: false,
      isTotal: false,
      expressionColor: {
        background: null,
        color: null,
      },
      ref: { qCanCollapse: false, qCanExpand: false },
    } as Cell;

    styleService = {
      nullValues: {
        background: "nullValuesBackground",
        color: "nullValuesColor",
        fontWeight: "nullValuesFontWeight",
        fontStyle: "nullValuesFontStyle",
        textDecoration: "nullValuesTextDecoration",
      },
      measureLabels: {
        background: "measureLabelsBackground",
        color: "measureLabelsColor",
        fontWeight: "measureLabelsFontWeight",
        fontStyle: "measureLabelsFontStyle",
        textDecoration: "measureLabelsTextDecoration",
      },
      totalValues: {
        background: "totalValuesBackground",
        color: "totalValuesColor",
        fontWeight: "totalValuesFontWeight",
        fontStyle: "totalValuesFontStyle",
        textDecoration: "totalValuesTextDecoration",
      },
      dimensionValues: {
        background: "dimensionValuesBackground",
        color: "dimensionValuesColor",
        fontWeight: "dimensionValuesFontWeight",
        fontStyle: "dimensionValuesFontStyle",
        textDecoration: "dimensionValuesTextDecoration",
      },
    } as StyleService;
  });

  describe("getBackground", () => {
    test("should resolve background for cell", () => {
      expect(getBackground({ cell, styleService, isCellSelected: false, isCellLocked: false })).toEqual(
        styleService.dimensionValues.background,
      );
    });

    test("should resolve background for selected cell", () => {
      expect(getBackground({ cell, styleService, isCellSelected: true, isCellLocked: false })).toEqual("#0aaf54");
    });

    test("should resolve background for locked cell", () => {
      styleService.dimensionValues.background = "red";
      const whiteSpaceRegEx = /\s/g;

      expect(
        (getBackground({ cell, styleService, isCellSelected: false, isCellLocked: true }) as string).replaceAll(
          whiteSpaceRegEx,
          "",
        ),
      ).toEqual(
        `repeating-linear-gradient(
          -45deg,
          rgb(255, 59, 29) 0px 2px,
          red 0px 4px
        )`.replaceAll(whiteSpaceRegEx, ""),
      );
    });

    test("should resolve background from expression", () => {
      cell.expressionColor.background = "expressionBackground";

      expect(getBackground({ cell, styleService, isCellSelected: false, isCellLocked: false })).toEqual(
        cell.expressionColor.background,
      );
    });

    test("should resolve background from null value cell", () => {
      cell.isNull = true;

      expect(getBackground({ cell, styleService, isCellSelected: false, isCellLocked: false })).toEqual(
        styleService.nullValues.background,
      );
    });

    test("should resolve background from pseudo dimnension cell", () => {
      cell.isPseudoDimension = true;

      expect(getBackground({ cell, styleService, isCellSelected: false, isCellLocked: false })).toEqual(
        styleService.measureLabels.background,
      );
    });

    test("should resolve background from total cell", () => {
      cell.isTotal = true;

      expect(getBackground({ cell, styleService, isCellSelected: false, isCellLocked: false })).toEqual(
        styleService.totalValues.background,
      );
    });
  });

  describe("getColor", () => {
    test("should resolve color for cell", () => {
      expect(getColor({ cell, styleService, isCellSelected: false })).toEqual(styleService.dimensionValues.color);
    });

    test("should resolve color for selected cell", () => {
      expect(getColor({ cell, styleService, isCellSelected: true })).toEqual("white");
    });

    test("should resolve color from expression", () => {
      cell.expressionColor.color = "expressionColor";

      expect(getColor({ cell, styleService, isCellSelected: false })).toEqual(cell.expressionColor.color);
    });

    test("should resolve color for null value cell", () => {
      cell.isNull = true;

      expect(getColor({ cell, styleService, isCellSelected: false })).toEqual(styleService.nullValues.color);
    });

    test("should resolve color for pseudo dimension cell", () => {
      cell.isPseudoDimension = true;

      expect(getColor({ cell, styleService, isCellSelected: false })).toEqual(styleService.measureLabels.color);
    });

    test("should resolve color for total cell", () => {
      cell.isTotal = true;

      expect(getColor({ cell, styleService, isCellSelected: false })).toEqual(styleService.totalValues.color);
    });
  });

  describe("getFontWeight", () => {
    test("should resolve fontWeight for cell", () => {
      expect(getFontWeight({ cell, styleService })).toEqual(styleService.dimensionValues.fontWeight);
    });

    test("should resolve fontWeight when cell can be expanded and fontWeight is undefined", () => {
      cell.ref.qCanExpand = true;
      styleService.dimensionValues.fontWeight = undefined;

      expect(getFontWeight({ cell, styleService })).toEqual(BOLD_FONT_WEIGHT);
    });

    test("hould resolve fontWeight when cell can be collapsed and fontWeight is undefined", () => {
      cell.ref.qCanCollapse = true;
      styleService.dimensionValues.fontWeight = undefined;

      expect(getFontWeight({ cell, styleService })).toEqual(BOLD_FONT_WEIGHT);
    });

    test("should resolve fontWeight when cell is a leaf node and fontWeight is undefined", () => {
      cell.ref.qCanExpand = false;
      cell.ref.qCanCollapse = false;
      styleService.dimensionValues.fontWeight = undefined;

      expect(getFontWeight({ cell, styleService })).toEqual(styleService.dimensionValues.fontWeight);
    });

    test("should resolve fontWeight for null value cell", () => {
      cell.isNull = true;

      expect(getFontWeight({ cell, styleService })).toEqual(styleService.nullValues.fontWeight);
    });

    test("should resolve fontWeight for pseudo dimension cell", () => {
      cell.isPseudoDimension = true;

      expect(getFontWeight({ cell, styleService })).toEqual(styleService.measureLabels.fontWeight);
    });

    test("should resolve fontWeight for total cell", () => {
      cell.isTotal = true;

      expect(getFontWeight({ cell, styleService })).toEqual(styleService.totalValues.fontWeight);
    });
  });

  describe("getFontStyle", () => {
    test("should resolve fontStyle for cell", () => {
      expect(getFontStyle({ cell, styleService })).toEqual(styleService.dimensionValues.fontStyle);
    });

    test("should resolve fontStyle for null value cell", () => {
      cell.isNull = true;

      expect(getFontStyle({ cell, styleService })).toEqual(styleService.nullValues.fontStyle);
    });

    test("should resolve fontStyle for pseudo dimension cell", () => {
      cell.isPseudoDimension = true;

      expect(getFontStyle({ cell, styleService })).toEqual(styleService.measureLabels.fontStyle);
    });

    test("should resolve fontStyle for total cell", () => {
      cell.isTotal = true;

      expect(getFontStyle({ cell, styleService })).toEqual(styleService.totalValues.fontStyle);
    });
  });

  describe("getTextDecoration", () => {
    test("should resolve textDecoration for cell", () => {
      expect(getTextDecoration({ cell, styleService })).toEqual(styleService.dimensionValues.textDecoration);
    });

    test("should resolve textDecoration for null value cell", () => {
      cell.isNull = true;

      expect(getTextDecoration({ cell, styleService })).toEqual(styleService.nullValues.textDecoration);
    });

    test("should resolve textDecoration for pseudo dimension cell", () => {
      cell.isPseudoDimension = true;

      expect(getTextDecoration({ cell, styleService })).toEqual(styleService.measureLabels.textDecoration);
    });

    test("should resolve textDecoration for total cell", () => {
      cell.isTotal = true;

      expect(getTextDecoration({ cell, styleService })).toEqual(styleService.totalValues.textDecoration);
    });
  });

  describe("getCursor", () => {
    test("should resolve cursor for cell that can be selected", () => {
      expect(getCursor(true)).toEqual("pointer");
    });

    test("should resolve cursor for cell that can NOT be selected", () => {
      expect(getCursor(false)).toEqual("default");
    });
  });
});
