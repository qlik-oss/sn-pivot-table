import { PSEUDO_DIMENSION_INDEX } from "../../../../constants";
import type { ExtendedDimensionInfo } from "../../../../types/QIX";
import NxDimCellType from "../../../../types/QIX";
import type { Cell, VisibleDimensionInfo } from "../../../../types/types";
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

  beforeEach(() => {
    dimensionInfo = { qLocked: false } as ExtendedDimensionInfo;
    node = {
      qUp: 1,
      qDown: 2,
      qType: NxDimCellType.NX_DIM_CELL_NORMAL,
      qSubNodes: [],
    } as unknown as EngineAPI.INxPivotDimensionCell;
    rootCell = {} as Cell;
    parentCell = { children: [] } as unknown as Cell;

    x = 10;
    y = 20;
    pageY = 30;
  });

  test("should store reference to the node", () => {
    cell = createCell(node, parentCell, rootCell, x, y, pageY, false, dimensionInfo);

    expect(cell.ref).toBe(node);
  });

  test("should set coordinates", () => {
    cell = createCell(node, parentCell, rootCell, x, y, pageY, false, dimensionInfo);

    expect(cell.x).toEqual(x);
    expect(cell.y).toEqual(y);
    expect(cell.pageX).toEqual(x);
    expect(cell.pageY).toEqual(pageY);
  });

  test("should set root and parent cells", () => {
    cell = createCell(node, parentCell, rootCell, x, y, pageY, false, dimensionInfo);

    expect(cell.root).toBe(rootCell);
    expect(cell.parent).toBe(parentCell);
  });

  test("should update parent with a reference to the child cell", () => {
    cell = createCell(node, parentCell, rootCell, x, y, pageY, false, dimensionInfo);

    expect(parentCell.children).toEqual([cell]);
  });

  describe("leafCount", () => {
    test("should default zero leafCount in snapshot mode", () => {
      cell = createCell(node, parentCell, rootCell, x, y, pageY, true, dimensionInfo);

      expect(cell.leafCount).toEqual(0);
    });

    test("leaf node should have 0 leaf count", () => {
      cell = createCell(node, parentCell, rootCell, x, y, pageY, false, dimensionInfo);

      expect(cell.leafCount).toEqual(0);
    });

    test("should return leafCount when node is not first node on page", () => {
      node.qSubNodes = [{}] as EngineAPI.INxPivotDimensionCell[]; // Node is not a leaf node
      cell = createCell(node, parentCell, rootCell, x, y, pageY, false, dimensionInfo);

      expect(cell.leafCount).toEqual(node.qUp + node.qDown);
    });

    test("should return leafCount when node is first node on page", () => {
      pageY = 0;
      node.qSubNodes = [{}] as EngineAPI.INxPivotDimensionCell[]; // Node is not a leaf node
      cell = createCell(node, parentCell, rootCell, x, y, pageY, false, dimensionInfo);

      expect(cell.leafCount).toEqual(node.qDown);
    });

    // test("should include leaf count from it child left nodes", () => {
    //   node.qSubNodes = [{}] as EngineAPI.INxPivotDimensionCell[]; // Node is not a leaf node
    //   parentCell = createCell(node, null, null, 0, 0, 0, false, dimensionInfo);
    //   const childNode = { ...node, qUp: 0, qDown: 0, qSubNodes: [] };
    //   const childCell = createCell(childNode, parentCell, parentCell, x, y, pageY, false, dimensionInfo);
    //   // cell.children.push(childCell);
    //   // cell.children.push(childCell);

    //   expect(parentCell.leafCount).toEqual(node.qUp + node.qDown + 2);
    // });
  });

  describe("isLockedByDimension", () => {
    test("should set isLockedByDimension to false when dimension info is a pseudo dimension", () => {
      dimensionInfo = PSEUDO_DIMENSION_INDEX;

      cell = createCell(node, parentCell, rootCell, x, y, pageY, false, dimensionInfo);

      expect(cell.isLockedByDimension).toBe(false);
    });

    test("should set isLockedByDimension to true when dimension info is locked", () => {
      (dimensionInfo as ExtendedDimensionInfo).qLocked = true;

      cell = createCell(node, parentCell, rootCell, x, y, pageY, false, dimensionInfo);

      expect(cell.isLockedByDimension).toBe(true);
    });

    test("should set isLockedByDimension to false when dimension info is not locked", () => {
      (dimensionInfo as ExtendedDimensionInfo).qLocked = false;

      cell = createCell(node, parentCell, rootCell, x, y, pageY, false, dimensionInfo);

      expect(cell.isLockedByDimension).toBe(false);
    });
  });

  test("should resolve if isTotalCell from qType", () => {
    node.qType = NxDimCellType.NX_DIM_CELL_TOTAL;
    cell = createCell(node, parentCell, rootCell, x, y, pageY, false, dimensionInfo);

    expect(cell.isTotal).toBe(true);
    expect(cell.isEmpty).toBe(false);
    expect(cell.isNull).toBe(false);
    expect(cell.isPseudoDimension).toBe(false);
  });

  test("should fallback to resolving isTotalCell from parent cell", () => {
    node.qType = NxDimCellType.NX_DIM_CELL_PSEUDO;
    parentCell.isTotal = true;
    cell = createCell(node, parentCell, rootCell, x, y, pageY, false, dimensionInfo);

    expect(cell.isTotal).toBe(true);
    expect(cell.isEmpty).toBe(false);
    expect(cell.isNull).toBe(false);
    expect(cell.isPseudoDimension).toBe(true);
  });

  test("should resolve if isEmptyCell from qType", () => {
    node.qType = NxDimCellType.NX_DIM_CELL_EMPTY;
    cell = createCell(node, parentCell, rootCell, x, y, pageY, false, dimensionInfo);

    expect(cell.isTotal).toBe(false);
    expect(cell.isEmpty).toBe(true);
    expect(cell.isNull).toBe(false);
    expect(cell.isPseudoDimension).toBe(false);
  });

  test("should resolve if isNullCell from qType", () => {
    node.qType = NxDimCellType.NX_DIM_CELL_NULL;
    cell = createCell(node, parentCell, rootCell, x, y, pageY, false, dimensionInfo);

    expect(cell.isTotal).toBe(false);
    expect(cell.isEmpty).toBe(false);
    expect(cell.isNull).toBe(true);
    expect(cell.isPseudoDimension).toBe(false);
  });

  test("should resolve if isPseudoDimensionCell from qType", () => {
    node.qType = NxDimCellType.NX_DIM_CELL_PSEUDO;
    cell = createCell(node, parentCell, rootCell, x, y, pageY, false, dimensionInfo);

    expect(cell.isTotal).toBe(false);
    expect(cell.isEmpty).toBe(false);
    expect(cell.isNull).toBe(false);
    expect(cell.isPseudoDimension).toBe(true);
  });

  describe("isLastChild", () => {
    test("should consider root cell as last child", () => {
      rootCell = createCell(node, null, null, x, y, pageY, false, dimensionInfo);

      expect(rootCell.isLastChild).toBe(true);
    });

    test("should set isLastChild", () => {
      parentCell.isLastChild = true;
      const cell0 = createCell(node, parentCell, rootCell, 1111, y, pageY, false, dimensionInfo);
      const cell1 = createCell(node, parentCell, rootCell, 2222, y, pageY, false, dimensionInfo);

      expect(cell0.isLastChild).toBe(false);
      expect(cell1.isLastChild).toBe(true);
    });

    test("should set isLastChild to false when parent cell is not last child", () => {
      parentCell.isLastChild = false;
      const cell0 = createCell(node, parentCell, rootCell, 1111, y, pageY, false, dimensionInfo);
      const cell1 = createCell(node, parentCell, rootCell, 2222, y, pageY, false, dimensionInfo);

      expect(cell0.isLastChild).toBe(false);
      expect(cell1.isLastChild).toBe(false);
    });
  });
});
