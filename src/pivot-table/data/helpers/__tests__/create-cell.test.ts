import { PSEUDO_DIMENSION_INDEX } from "../../../../constants";
import type { ExtendedDimensionInfo } from "../../../../types/QIX";
import NxDimCellType from "../../../../types/QIX";
import type { AttrExprInfoIndex, Cell, LayoutService, VisibleDimensionInfo } from "../../../../types/types";
import { MAX_ROW_COUNT } from "../../../constants";
import createCell from "../create-cell";

describe("createCell", () => {
  let dimensionInfo: VisibleDimensionInfo;
  let node: EngineAPI.INxPivotDimensionCell;
  let cell: Cell;
  let rootCell: Cell;
  let parentCell: Cell;
  let x: number;
  let y: number;
  let pageY: number;
  let layoutService: LayoutService;
  const attrExprInfoIndex: AttrExprInfoIndex = { cellForegroundColor: -1, cellBackgroundColor: -1 };

  beforeEach(() => {
    dimensionInfo = { qLocked: false } as ExtendedDimensionInfo;
    node = {
      qUp: 1,
      qDown: 2,
      qType: NxDimCellType.NX_DIM_CELL_NORMAL,
      qSubNodes: [],
    } as unknown as EngineAPI.INxPivotDimensionCell;
    rootCell = {} as Cell;
    parentCell = { children: [], pageY: 0 } as unknown as Cell;
    layoutService = {
      isSnapshot: false,
      getDimensionInfoIndex: (info: VisibleDimensionInfo) => (info === -1 ? -1 : 0),
    } as LayoutService;

    x = 10;
    y = 20;
    pageY = 30;
  });

  test("should store reference to the node", () => {
    cell = createCell({
      node,
      parent: parentCell,
      root: rootCell,
      x,
      y,
      pageY,
      layoutService,
      dimensionInfo,
      attrExprInfoIndex,
    });

    expect(cell.ref).toBe(node);
  });

  test("should set coordinates", () => {
    cell = createCell({
      node,
      parent: parentCell,
      root: rootCell,
      x,
      y,
      pageY,
      layoutService,
      dimensionInfo,
      attrExprInfoIndex,
    });

    expect(cell.x).toEqual(x);
    expect(cell.y).toEqual(y);
    expect(cell.pageX).toEqual(x);
    expect(cell.pageY).toEqual(pageY);
  });

  test("should set root and parent cells", () => {
    cell = createCell({
      node,
      parent: parentCell,
      root: rootCell,
      x,
      y,
      pageY,
      layoutService,
      dimensionInfo,
      attrExprInfoIndex,
    });

    expect(cell.root).toBe(rootCell);
    expect(cell.parent).toBe(parentCell);
  });

  test("should update parent with a reference to the child cell", () => {
    cell = createCell({
      node,
      parent: parentCell,
      root: rootCell,
      x,
      y,
      pageY,
      layoutService,
      dimensionInfo,
      attrExprInfoIndex,
    });

    expect(parentCell.children[cell.mainAxisPageCoord - parentCell.mainAxisPageCoord]).toEqual(cell);
  });

  describe("leafCount", () => {
    test("leaf node should have 0 leaf count", () => {
      node.qUp = 0;
      node.qDown = 0;
      node.qSubNodes = [];
      cell = createCell({
        node,
        parent: parentCell,
        root: rootCell,
        x,
        y,
        pageY,
        layoutService,
        dimensionInfo,
        attrExprInfoIndex,
      });

      expect(cell.leafCount).toEqual(0);
    });

    test("should return leafCount when node is not first node on page", () => {
      node.qSubNodes = [{ qSubNodes: [] }] as unknown as EngineAPI.INxPivotDimensionCell[]; // Node is not a leaf node
      cell = createCell({
        node,
        parent: parentCell,
        root: rootCell,
        x,
        y,
        pageY,
        layoutService,
        dimensionInfo,
        attrExprInfoIndex,
      });

      expect(cell.leafCount).toEqual(node.qUp + node.qDown + 1);
    });

    test("should return leafCount when node is first node on page", () => {
      y = MAX_ROW_COUNT - 1;
      pageY = 0;
      node.qSubNodes = [{ qSubNodes: [] }] as unknown as EngineAPI.INxPivotDimensionCell[]; // Node is not a leaf node
      cell = createCell({
        node,
        parent: parentCell,
        root: rootCell,
        x,
        y,
        pageY,
        layoutService,
        dimensionInfo,
        attrExprInfoIndex,
      });

      expect(cell.leafCount).toEqual(node.qDown + 1);
    });

    test("should count all leaf nodes", () => {
      const greatGrandChildren = [{ qSubNodes: [] }, { qSubNodes: [] }, { qSubNodes: [] }];
      node.qSubNodes = [
        { qSubNodes: [{ qSubNodes: [{ qSubNodes: greatGrandChildren }] }] },
        { qSubNodes: [{ qSubNodes: [{ qSubNodes: greatGrandChildren }] }] },
      ] as unknown as EngineAPI.INxPivotDimensionCell[]; // Node is not a leaf node
      rootCell = createCell({
        node,
        parent: null,
        root: null,
        x: 0,
        y: 0,
        pageY: 0,
        layoutService,
        dimensionInfo,
        attrExprInfoIndex,
      });

      expect(rootCell.leafCount).toEqual(node.qUp + node.qDown + greatGrandChildren.length * 2);
    });

    test("should exclude qDown and qUp in a snapshot", () => {
      layoutService.isSnapshot = true;
      const greatGrandChildren = [{ qSubNodes: [] }, { qSubNodes: [] }, { qSubNodes: [] }];
      node.qUp = 1000;
      node.qDown = 2000;
      node.qSubNodes = [
        { qSubNodes: [{ qSubNodes: [{ qSubNodes: greatGrandChildren }] }] },
      ] as unknown as EngineAPI.INxPivotDimensionCell[]; // Node is not a leaf node
      parentCell = createCell({
        node,
        parent: null,
        root: null,
        x: 0,
        y: 0,
        pageY: 0,
        layoutService,
        dimensionInfo,
        attrExprInfoIndex,
      });

      expect(parentCell.leafCount).toEqual(greatGrandChildren.length);
    });
  });

  describe("isLockedByDimension", () => {
    test("should set isLockedByDimension to false when dimension info is a pseudo dimension", () => {
      dimensionInfo = PSEUDO_DIMENSION_INDEX;

      cell = createCell({
        node,
        parent: parentCell,
        root: rootCell,
        x,
        y,
        pageY,
        layoutService,
        dimensionInfo,
        attrExprInfoIndex,
      });

      expect(cell.isLockedByDimension).toBe(false);
    });

    test("should set isLockedByDimension to true when dimension info is locked", () => {
      (dimensionInfo as ExtendedDimensionInfo).qLocked = true;

      cell = createCell({
        node,
        parent: parentCell,
        root: rootCell,
        x,
        y,
        pageY,
        layoutService,
        dimensionInfo,
        attrExprInfoIndex,
      });

      expect(cell.isLockedByDimension).toBe(true);
    });

    test("should set isLockedByDimension to false when dimension info is not locked", () => {
      (dimensionInfo as ExtendedDimensionInfo).qLocked = false;

      cell = createCell({
        node,
        parent: parentCell,
        root: rootCell,
        x,
        y,
        pageY,
        layoutService,
        dimensionInfo,
        attrExprInfoIndex,
      });

      expect(cell.isLockedByDimension).toBe(false);
    });
  });

  test("should resolve if isTotalCell from qType", () => {
    node.qType = NxDimCellType.NX_DIM_CELL_TOTAL;
    cell = createCell({
      node,
      parent: parentCell,
      root: rootCell,
      x,
      y,
      pageY,
      layoutService,
      dimensionInfo,
      attrExprInfoIndex,
    });

    expect(cell.isTotal).toBe(true);
    expect(cell.isEmpty).toBe(false);
    expect(cell.isNull).toBe(false);
    expect(cell.isPseudoDimension).toBe(false);
  });

  test("should fallback to resolving isTotalCell from parent cell", () => {
    node.qType = NxDimCellType.NX_DIM_CELL_PSEUDO;
    parentCell.isTotal = true;
    cell = createCell({
      node,
      parent: parentCell,
      root: rootCell,
      x,
      y,
      pageY,
      layoutService,
      dimensionInfo,
      attrExprInfoIndex,
    });

    expect(cell.isTotal).toBe(true);
    expect(cell.isEmpty).toBe(false);
    expect(cell.isNull).toBe(false);
    expect(cell.isPseudoDimension).toBe(true);
  });

  test("should resolve if isEmptyCell from qType", () => {
    node.qType = NxDimCellType.NX_DIM_CELL_EMPTY;
    cell = createCell({
      node,
      parent: parentCell,
      root: rootCell,
      x,
      y,
      pageY,
      layoutService,
      dimensionInfo,
      attrExprInfoIndex,
    });

    expect(cell.isTotal).toBe(false);
    expect(cell.isEmpty).toBe(true);
    expect(cell.isNull).toBe(false);
    expect(cell.isPseudoDimension).toBe(false);
  });

  test("should resolve if isNullCell from qType", () => {
    node.qType = NxDimCellType.NX_DIM_CELL_NULL;
    cell = createCell({
      node,
      parent: parentCell,
      root: rootCell,
      x,
      y,
      pageY,
      layoutService,
      dimensionInfo,
      attrExprInfoIndex,
    });

    expect(cell.isTotal).toBe(false);
    expect(cell.isEmpty).toBe(false);
    expect(cell.isNull).toBe(true);
    expect(cell.isPseudoDimension).toBe(false);
  });

  test("should resolve if isPseudoDimensionCell from qType", () => {
    node.qType = NxDimCellType.NX_DIM_CELL_PSEUDO;
    cell = createCell({
      node,
      parent: parentCell,
      root: rootCell,
      x,
      y,
      pageY,
      layoutService,
      dimensionInfo,
      attrExprInfoIndex,
    });

    expect(cell.isTotal).toBe(false);
    expect(cell.isEmpty).toBe(false);
    expect(cell.isNull).toBe(false);
    expect(cell.isPseudoDimension).toBe(true);
  });

  describe("visibleMeasureInfoIndex", () => {
    test("pseudo dimension cell should have correct index", () => {
      node.qType = NxDimCellType.NX_DIM_CELL_PSEUDO;
      node.qElemNo = 0;

      cell = createCell({
        node,
        parent: parentCell,
        root: rootCell,
        x,
        y,
        pageY,
        layoutService,
        dimensionInfo,
        attrExprInfoIndex,
      });

      expect(cell.visibleMeasureInfoIndex).toBe(0);
    });

    test("dimension cell with an ancestor that is pseudo dimension cell should have correct index", () => {
      parentCell.visibleMeasureInfoIndex = 0;

      cell = createCell({
        node,
        parent: parentCell,
        root: rootCell,
        x,
        y,
        pageY,
        layoutService,
        dimensionInfo,
        attrExprInfoIndex,
      });

      expect(cell.visibleMeasureInfoIndex).toBe(0);
    });

    test("cell should have no index if node tree have no pseudo dimension", () => {
      cell = createCell({
        node,
        parent: parentCell,
        root: rootCell,
        x,
        y,
        pageY,
        layoutService,
        dimensionInfo,
        attrExprInfoIndex,
      });

      expect(cell.visibleMeasureInfoIndex).toBe(undefined);
    });
  });
});
