import { PSEUDO_DIMENSION_INDEX } from "../../constants";
import { MAX_COLUMN_COUNT, MAX_ROW_COUNT } from "../../pivot-table/constants";
import type { ExtendedDimensionInfo, ExtendedMeasureInfo, PivotLayout, SnapshotData } from "../../types/QIX";
import type { LayoutService } from "../../types/types";
import createLayoutService from "../layout-service";

const getMeasureInfo = () => ({}) as ExtendedMeasureInfo;

const getDimensionInfo = ({ qLocked, isVisible, id }: { qLocked?: boolean; isVisible?: boolean; id?: string }) =>
  ({
    cId: id ?? "",
    qLocked: !qLocked,
    qCardinalities: {
      qHypercubeCardinal: isVisible ? 1 : 0,
    },
  }) as unknown as ExtendedDimensionInfo;

describe("createLayoutService", () => {
  let layout: PivotLayout;
  let create: () => LayoutService;
  let effectiveProperties: EngineAPI.IGenericObjectProperties | undefined;

  beforeEach(() => {
    layout = {
      nullValueRepresentation: { text: "NULL" },
      qHyperCube: {
        qNoOfLeftDims: 1,
        qEffectiveInterColumnSortOrder: [0, 1, -1],
        qMeasureInfo: [getMeasureInfo(), getMeasureInfo()],
        qDimensionInfo: [
          getDimensionInfo({ qLocked: false, isVisible: true }),
          getDimensionInfo({ qLocked: false, isVisible: true }),
        ],
        qSize: {
          qcx: 100,
          qcy: 200,
        },
      },
    } as PivotLayout;

    create = () => createLayoutService(layout, effectiveProperties);
  });

  describe("getNullValueText", () => {
    test("should return null value text", () => {
      const service = create();
      expect(service.getNullValueText()).toEqual("NULL");
    });

    test("should return default null value text", () => {
      layout.nullValueRepresentation = undefined;
      const service = create();
      expect(service.getNullValueText()).toEqual("-");
    });
  });

  describe("getMeasureInfoIndexFromCellIndex", () => {
    test("should return measure info index when there is only a single measure", () => {
      layout.qHyperCube.qMeasureInfo = [getMeasureInfo()];
      layout.qHyperCube.qEffectiveInterColumnSortOrder = [0, 1];
      const service = create();
      expect(service.getMeasureInfoIndexFromCellIndex(0)).toEqual(0);
      expect(service.getMeasureInfoIndexFromCellIndex(1)).toEqual(0);
    });

    test("should return measure info index when pseudo dimension is on the left", () => {
      layout.qHyperCube.qNoOfLeftDims = 1;
      layout.qHyperCube.qEffectiveInterColumnSortOrder = [-1, 0, 1];
      layout.qHyperCube.qMeasureInfo = [getMeasureInfo(), getMeasureInfo()];
      const service = create();
      expect(service.getMeasureInfoIndexFromCellIndex(0)).toEqual(0);
      expect(service.getMeasureInfoIndexFromCellIndex(1)).toEqual(0);
    });

    test("should return measure info index when pseudo dimension is on the top", () => {
      layout.qHyperCube.qNoOfLeftDims = 1;
      layout.qHyperCube.qEffectiveInterColumnSortOrder = [0, 1, -1];
      layout.qHyperCube.qMeasureInfo = [getMeasureInfo(), getMeasureInfo(), getMeasureInfo()];
      const service = create();
      expect(service.getMeasureInfoIndexFromCellIndex(0)).toEqual(0);
      expect(service.getMeasureInfoIndexFromCellIndex(1)).toEqual(1);
      expect(service.getMeasureInfoIndexFromCellIndex(2)).toEqual(2);
      expect(service.getMeasureInfoIndexFromCellIndex(3)).toEqual(0);
      expect(service.getMeasureInfoIndexFromCellIndex(4)).toEqual(1);
      expect(service.getMeasureInfoIndexFromCellIndex(5)).toEqual(2);
    });

    test("should return measure info index when a measure is hidden before the requested index", () => {
      const hiddenMeasure = getMeasureInfo();
      hiddenMeasure.qError = { qErrorCode: 7005 };
      layout.qHyperCube.qMeasureInfo = [getMeasureInfo(), hiddenMeasure, getMeasureInfo(), getMeasureInfo()];
      const service = create();
      expect(service.getMeasureInfoIndexFromCellIndex(0)).toEqual(0);
      expect(service.getMeasureInfoIndexFromCellIndex(1)).toEqual(2);
    });

    test("should return measure info index when a measure is hidden before the requested visible index", () => {
      const getVisibleIndex = true;
      const hiddenMeasure = getMeasureInfo();
      hiddenMeasure.qError = { qErrorCode: 7005 };
      layout.qHyperCube.qMeasureInfo = [getMeasureInfo(), hiddenMeasure, getMeasureInfo(), getMeasureInfo()];
      const service = create();
      expect(service.getMeasureInfoIndexFromCellIndex(0, getVisibleIndex)).toEqual(0);
      expect(service.getMeasureInfoIndexFromCellIndex(1, getVisibleIndex)).toEqual(1);
    });
  });

  describe("getDimensionInfoIndex", () => {
    test("should return index for dimension info", () => {
      layout.qHyperCube.qEffectiveInterColumnSortOrder = [2, -1, 0];
      layout.qHyperCube.qMeasureInfo = [getMeasureInfo(), getMeasureInfo()];
      layout.qHyperCube.qDimensionInfo = [
        getDimensionInfo({ qLocked: false, isVisible: true }),
        getDimensionInfo({ qLocked: false, isVisible: true }),
        getDimensionInfo({ qLocked: false, isVisible: true }),
        getDimensionInfo({ qLocked: false, isVisible: true }),
      ];

      const service = create();
      expect(service.getDimensionInfoIndex(layout.qHyperCube.qDimensionInfo[0])).toEqual(0);
      expect(service.getDimensionInfoIndex(layout.qHyperCube.qDimensionInfo[2])).toEqual(2);
      expect(service.getDimensionInfoIndex(layout.qHyperCube.qDimensionInfo[1])).toEqual(-1);
      expect(service.getDimensionInfoIndex(layout.qHyperCube.qDimensionInfo[3])).toEqual(-1);
      expect(service.getDimensionInfoIndex(-1)).toEqual(-1);
    });
  });

  describe("getDimensionInfo", () => {
    test("should return dimension info for index", () => {
      layout.qHyperCube.qEffectiveInterColumnSortOrder = [2, -1, 0];
      layout.qHyperCube.qMeasureInfo = [getMeasureInfo(), getMeasureInfo()];
      layout.qHyperCube.qDimensionInfo = [
        getDimensionInfo({ qLocked: false, isVisible: true, id: "a" }),
        getDimensionInfo({ qLocked: false, isVisible: true, id: "b" }),
        getDimensionInfo({ qLocked: false, isVisible: true, id: "c" }),
        getDimensionInfo({ qLocked: false, isVisible: true, id: "d" }),
      ];

      const service = create();
      expect(service.getDimensionInfo(0)).toEqual(layout.qHyperCube.qDimensionInfo[2]);
      expect(service.getDimensionInfo(2)).toEqual(layout.qHyperCube.qDimensionInfo[0]);
      expect(service.getDimensionInfo(-1)).toEqual(PSEUDO_DIMENSION_INDEX);
      expect(service.getDimensionInfo(3)).toBeUndefined();
    });
  });

  describe("size", () => {
    test("should return size", () => {
      const service = create();
      expect(service.size).toEqual({ x: layout.qHyperCube.qSize.qcx, y: layout.qHyperCube.qSize.qcy });
    });

    test("should return limited column size", () => {
      layout.qHyperCube.qSize.qcx = MAX_COLUMN_COUNT + 1;
      const service = create();
      expect(service.size).toEqual({ x: MAX_COLUMN_COUNT, y: layout.qHyperCube.qSize.qcy });
    });

    test("should return limited row size", () => {
      layout.qHyperCube.qSize.qcy = MAX_ROW_COUNT + 1;
      const service = create();
      expect(service.size).toEqual({ x: layout.qHyperCube.qSize.qcx, y: MAX_ROW_COUNT });
    });

    test("should return size for snapshot", () => {
      const dataPage = { qArea: { qWidth: 123, qHeight: 321, qTop: 0, qLeft: 0 } } as unknown as EngineAPI.INxPivotPage;
      layout.snapshotData = {
        content: {
          qPivotDataPages: [dataPage],
        },
      } as SnapshotData;
      const service = create();
      expect(service.size).toEqual({ x: dataPage.qArea.qWidth, y: dataPage.qArea.qHeight });
    });
  });

  describe("isSnapshot", () => {
    test("should return true when layout has snapshot data", () => {
      layout.snapshotData = {} as SnapshotData;
      const service = create();
      expect(service.isSnapshot).toBe(true);
    });
  });

  describe("hasLeftDimensions", () => {
    test("should be true when qNoOfLeftDims is larger then 0", () => {
      layout.qHyperCube.qNoOfLeftDims = 1;
      const service = create();
      expect(service.hasLeftDimensions).toBe(true);
    });

    test("should be true when qNoOfLeftDims -1", () => {
      layout.qHyperCube.qNoOfLeftDims = -1;
      const service = create();
      expect(service.hasLeftDimensions).toBe(true);
    });

    test("should be false when qNoOfLeftDims is 0", () => {
      layout.qHyperCube.qNoOfLeftDims = 0;
      const service = create();
      expect(service.hasLeftDimensions).toBe(false);
    });
  });

  describe("showTotalsAbove", () => {
    test("should be false when property is false", () => {
      effectiveProperties = {
        qHyperCubeDef: { qShowTotalsAbove: false },
      } as unknown as EngineAPI.IGenericObjectProperties;

      const service = create();
      expect(service.showTotalsAbove).toBe(false);
    });

    test("should be true when property is true", () => {
      effectiveProperties = {
        qHyperCubeDef: { qShowTotalsAbove: true },
      } as unknown as EngineAPI.IGenericObjectProperties;

      const service = create();
      expect(service.showTotalsAbove).toBe(true);
    });

    test("should be false when effective properties is undefined", () => {
      effectiveProperties = undefined;

      const service = create();
      expect(service.showTotalsAbove).toBe(false);
    });
  });

  describe("hasData", () => {
    test("should be true when there is data", () => {
      layout.qHyperCube.qSize.qcx = 1;
      layout.qHyperCube.qSize.qcy = 1;
      const service = create();
      expect(service.hasData).toBe(true);
    });

    test("should be false when there is no data", () => {
      layout.qHyperCube.qSize.qcx = 0;
      layout.qHyperCube.qSize.qcy = 0;
      const service = create();
      expect(service.hasData).toBe(false);
    });
  });
});
