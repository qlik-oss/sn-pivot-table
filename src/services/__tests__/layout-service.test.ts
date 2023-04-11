import { PivotLayout } from "../../types/QIX";
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

    test("should return false when dimension index does not exist", () => {
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

    test("should return false when dimension index does not exist", () => {
      layout.qHyperCube.qDimensionInfo = [];
      const service = create();
      expect(service.isDimensionLocked("T", 0, 0)).toEqual(false);
    });

    test("should return false when cell type is not supported", () => {
      const service = create();
      expect(service.isDimensionLocked("D", 0, 0)).toEqual(false);
    });
  });
});
