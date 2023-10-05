import { renderHook } from "@testing-library/react";
import { PSEUDO_DIMENSION_INDEX } from "../../../constants";
import type { ExtendedMeasureInfo } from "../../../types/QIX";
import { AttrExprInfoIDs, type VisibleDimensionInfo } from "../../../types/types";
import useAttrExprInfoIndexes from "../use-attr-expr-info-indexes";

describe("useAttrExprInfoIndexes", () => {
  let visibleLeftDimensionInfo: VisibleDimensionInfo[];
  let visibleTopDimensionInfo: VisibleDimensionInfo[];
  let qMeasureInfo: ExtendedMeasureInfo[];

  beforeEach(() => {
    visibleLeftDimensionInfo = [
      {
        qAttrExprInfo: [{ id: AttrExprInfoIDs.CellForegroundColor }, { id: AttrExprInfoIDs.CellBackgroundColor }],
      } as unknown as VisibleDimensionInfo,
    ];
    visibleTopDimensionInfo = [
      {
        qAttrExprInfo: [{ id: AttrExprInfoIDs.CellBackgroundColor }, { id: AttrExprInfoIDs.CellForegroundColor }],
      } as unknown as VisibleDimensionInfo,
    ];
    qMeasureInfo = [
      {
        qAttrExprInfo: [
          { id: AttrExprInfoIDs.CellBackgroundColor },
          { id: "some other kind" },
          { id: AttrExprInfoIDs.CellForegroundColor },
        ],
      } as unknown as ExtendedMeasureInfo,
    ];
  });

  test("should return attribute expression info indexes", () => {
    const { result } = renderHook(() =>
      useAttrExprInfoIndexes(visibleLeftDimensionInfo, visibleTopDimensionInfo, qMeasureInfo),
    );

    expect(result.current).toEqual({
      left: [{ cellForegroundColor: 0, cellBackgroundColor: 1 }],
      top: [{ cellForegroundColor: 1, cellBackgroundColor: 0 }],
      measures: [{ cellForegroundColor: 2, cellBackgroundColor: 0 }],
    });
  });

  test("should handle pseudo dimension", () => {
    visibleLeftDimensionInfo.unshift(PSEUDO_DIMENSION_INDEX);
    const { result } = renderHook(() => useAttrExprInfoIndexes(visibleLeftDimensionInfo, [], []));

    expect(result.current).toEqual({
      left: [
        { cellForegroundColor: -1, cellBackgroundColor: -1 },
        { cellForegroundColor: 0, cellBackgroundColor: 1 },
      ],
      top: [],
      measures: [],
    });
  });

  test("should handle when there is no matching IDs", () => {
    visibleLeftDimensionInfo = [
      {
        qAttrExprInfo: [{ id: "random ID" }, { id: "another random ID" }],
      } as unknown as VisibleDimensionInfo,
    ];
    const { result } = renderHook(() => useAttrExprInfoIndexes(visibleLeftDimensionInfo, [], []));

    expect(result.current).toEqual({
      left: [{ cellForegroundColor: -1, cellBackgroundColor: -1 }],
      top: [],
      measures: [],
    });
  });
});
