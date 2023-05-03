import { MAX_COLUMN_COUNT } from "../../pivot-table/constants";
import { PivotLayout, SnapshotData } from "../../types/QIX";
import { LayoutService } from "../../types/types";
import createLayoutService from "../layout-service";

const getMeasureInfo = () => ({} as EngineAPI.INxMeasureInfo);

const getDimensionInfo = (qLocked: boolean) => ({ qLocked } as EngineAPI.INxDimensionInfo);

describe("createLayoutService", () => {
  let layout: PivotLayout;
  let create: () => LayoutService;

  beforeEach(() => {
    layout = {
      nullValueRepresentation: { text: "NULL" },
      qHyperCube: {
        qNoOfLeftDims: 1,
        qEffectiveInterColumnSortOrder: [0, 1, -1],
        qMeasureInfo: [getMeasureInfo()],
        qDimensionInfo: [{ qLocked: false }, { qLocked: false }],
        qSize: {
          qcx: 100,
          qcy: 200,
        },
      },
    } as PivotLayout;

    create = () => createLayoutService(layout);
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
  });

  describe("isDimensionLocked", () => {
    test("should return true when left dimension is locked", () => {
      layout.qHyperCube.qDimensionInfo = [getDimensionInfo(true), getDimensionInfo(false)];
      const service = create();
      expect(service.isDimensionLocked("L", 0, 0)).toEqual(true);
    });

    test("should return false when left dimension is not locked", () => {
      layout.qHyperCube.qDimensionInfo = [getDimensionInfo(false), getDimensionInfo(true)];
      const service = create();
      expect(service.isDimensionLocked("L", 0, 0)).toEqual(false);
    });

    test("should return false when dimension index does not exist for tyoe L", () => {
      layout.qHyperCube.qDimensionInfo = [];
      const service = create();
      expect(service.isDimensionLocked("L", 0, 0)).toEqual(false);
    });

    test("should return true when top dimension is locked", () => {
      layout.qHyperCube.qDimensionInfo = [getDimensionInfo(false), getDimensionInfo(true)];
      const service = create();
      expect(service.isDimensionLocked("T", 0, 0)).toEqual(true);
    });

    test("should return false when top dimension is not locked", () => {
      layout.qHyperCube.qDimensionInfo = [getDimensionInfo(true), getDimensionInfo(false)];
      const service = create();
      expect(service.isDimensionLocked("T", 0, 0)).toEqual(false);
    });

    test("should return false when dimension index does not exist for type T", () => {
      layout.qHyperCube.qDimensionInfo = [];
      const service = create();
      expect(service.isDimensionLocked("T", 0, 0)).toEqual(false);
    });

    test("should return false when cell type is not supported", () => {
      const service = create();
      expect(service.isDimensionLocked("D", 0, 0)).toEqual(false);
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
});
