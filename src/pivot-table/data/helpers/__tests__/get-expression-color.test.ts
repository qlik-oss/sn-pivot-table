import { COLORING } from "@qlik/nebula-table-utils/lib/utils";
import type { AttrExprInfoIndex } from "../../../../types/types";
import getExpressionColor from "../get-expression-color";

describe("getExpressionColor", () => {
  let attrsExprInfoIndex: AttrExprInfoIndex;
  let cell: EngineAPI.INxPivotValuePoint | EngineAPI.INxPivotDimensionCell;

  beforeEach(() => {
    attrsExprInfoIndex = { cellForegroundColor: 0, cellBackgroundColor: 1 };
    cell = {
      qAttrExps: { qValues: [{ qText: "ARGB(255,176,134,82)" }, { qText: "RGB(10,9,23)" }] },
    } as unknown as EngineAPI.INxPivotDimensionCell;
  });

  test("should return color and background", () => {
    const expressionColor = getExpressionColor(attrsExprInfoIndex, cell);

    expect(expressionColor).toEqual({
      background: "rgb(10, 9, 23)",
      color: "rgb(255, 176, 134)",
    });
  });

  test("should return contrasting color when background is dark and there is no expression for color", () => {
    attrsExprInfoIndex = { cellForegroundColor: -1, cellBackgroundColor: 0 };
    cell = {
      qAttrExps: { qValues: [{ qText: "black" }] },
    } as unknown as EngineAPI.INxPivotDimensionCell;
    const expressionColor = getExpressionColor(attrsExprInfoIndex, cell);

    expect(expressionColor).toEqual({
      background: "rgb(0, 0, 0)",
      color: COLORING.WHITE,
    });
  });

  test("should return contrasting color when background is light and there is no expression for color", () => {
    attrsExprInfoIndex = { cellForegroundColor: -1, cellBackgroundColor: 0 };
    cell = {
      qAttrExps: { qValues: [{ qText: "white" }] },
    } as unknown as EngineAPI.INxPivotDimensionCell;
    const expressionColor = getExpressionColor(attrsExprInfoIndex, cell);

    expect(expressionColor).toEqual({
      background: "rgb(255, 255, 255)",
      color: COLORING.TEXT,
    });
  });

  test("should handle when there is no color or background color", () => {
    attrsExprInfoIndex = { cellForegroundColor: -1, cellBackgroundColor: -1 };
    const expressionColor = getExpressionColor(attrsExprInfoIndex, cell);

    expect(expressionColor).toEqual({
      background: null,
      color: null,
    });
  });
});
