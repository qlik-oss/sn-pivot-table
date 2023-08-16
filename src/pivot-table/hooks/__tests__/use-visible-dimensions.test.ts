import { renderHook } from "@testing-library/react";
import type { PivotLayout } from "../../../types/QIX";
import type { LayoutService } from "../../../types/types";
import useVisibleDimensions from "../use-visible-dimensions";

describe("useVisibleDimensions", () => {
  let layoutService: LayoutService;
  let qPivotDataPages: EngineAPI.INxPivotPage[];

  beforeEach(() => {
    layoutService = {
      layout: {
        qHyperCube: {},
      } as PivotLayout,
    } as LayoutService;

    qPivotDataPages = [];
  });

  test("should handle empty qPivotDataPages", () => {
    const { visibleLeftDimensionInfo, visibleTopDimensionInfo } = renderHook(() =>
      useVisibleDimensions(layoutService, qPivotDataPages)
    ).result.current;
    expect(visibleLeftDimensionInfo).toHaveLength(0);
    expect(visibleTopDimensionInfo).toHaveLength(0);
  });

  describe("VisibleLeftDimensionInfo", () => {
    test("should only include visibile dimensions and pseudo dimension", () => {
      qPivotDataPages.push({
        qLeft: [{ qType: "N", qSubNodes: [{ qType: "P", qSubNodes: [] }] }],
        qTop: [],
      } as unknown as EngineAPI.INxPivotPage);
      const { qHyperCube } = layoutService.layout;
      qHyperCube.qEffectiveInterColumnSortOrder = [1, -1, 0, 2];
      qHyperCube.qNoOfLeftDims = 4;
      qHyperCube.qDimensionInfo = [{}, {}, {}] as EngineAPI.INxDimensionInfo[];
      const { visibleLeftDimensionInfo, visibleTopDimensionInfo } = renderHook(() =>
        useVisibleDimensions(layoutService, qPivotDataPages)
      ).result.current;
      expect(visibleTopDimensionInfo).toEqual([]);
      expect(visibleLeftDimensionInfo).toEqual([
        qHyperCube.qDimensionInfo[qHyperCube.qEffectiveInterColumnSortOrder[0]],
        -1,
      ]);
    });
  });

  describe("VisibleTopDimensionInfo", () => {
    test("should only include visibile dimensions and pseudo dimension", () => {
      qPivotDataPages.push({
        qLeft: [],
        qTop: [{ qType: "N", qSubNodes: [{ qType: "P", qSubNodes: [] }] }],
      } as unknown as EngineAPI.INxPivotPage);
      const { qHyperCube } = layoutService.layout;
      qHyperCube.qEffectiveInterColumnSortOrder = [1, -1, 0, 2];
      qHyperCube.qNoOfLeftDims = 0;
      qHyperCube.qDimensionInfo = [{}, {}, {}] as EngineAPI.INxDimensionInfo[];
      const { visibleLeftDimensionInfo, visibleTopDimensionInfo } = renderHook(() =>
        useVisibleDimensions(layoutService, qPivotDataPages)
      ).result.current;
      expect(visibleLeftDimensionInfo).toEqual([]);
      expect(visibleTopDimensionInfo).toEqual([
        qHyperCube.qDimensionInfo[qHyperCube.qEffectiveInterColumnSortOrder[0]],
        -1,
      ]);
    });
  });
});
