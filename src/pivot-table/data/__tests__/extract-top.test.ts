import NxDimCellType from "../../../types/QIX";
import type { Cell, LayoutService } from "../../../types/types";
import extractTopGrid from "../extract-top";
import createNodes from "./test-helper";

describe("extractTop", () => {
  let layoutService: LayoutService;
  const qArea = { qLeft: 1 } as EngineAPI.INxDataAreaPage;
  const grid = [] as Cell[][];

  beforeEach(() => {
    layoutService = {
      isSnapshot: false,
      sortedTopDimensionInfo: [],
    } as unknown as LayoutService;
  });

  test("should handle empty qTop array", () => {
    const qTop: EngineAPI.INxPivotDimensionCell[] = [];

    const top = extractTopGrid(grid, qTop, qArea, layoutService);

    expect(top).toHaveLength(0);
  });

  test("should extract top data with no nodes expanded", () => {
    const colCount = 3;
    const qTop = createNodes(colCount, NxDimCellType.NX_DIM_CELL_NORMAL);

    const top = extractTopGrid(grid, qTop, qArea, layoutService);

    expect(top).toMatchSnapshot();
  });

  test("should extract top data with first node expanded", () => {
    const colCount = 3;
    const subNodesCount = 2;
    const qTop = createNodes(colCount, NxDimCellType.NX_DIM_CELL_NORMAL);
    const subNodes = createNodes(subNodesCount, NxDimCellType.NX_DIM_CELL_NORMAL);
    qTop[0].qSubNodes = subNodes;
    qTop[0].qCanCollapse = true;

    const top = extractTopGrid(grid, qTop, qArea, layoutService);

    expect(top).toMatchSnapshot();
  });

  test("should extract top data when data tree has a depth of 2", () => {
    const colCount = 3;
    const subNodesCount = 2;
    const qTop = createNodes(colCount, NxDimCellType.NX_DIM_CELL_NORMAL);
    qTop[0].qSubNodes = createNodes(1, NxDimCellType.NX_DIM_CELL_EMPTY);
    qTop[0].qSubNodes[0].qSubNodes = createNodes(1, NxDimCellType.NX_DIM_CELL_EMPTY);

    qTop[1].qSubNodes = createNodes(1, NxDimCellType.NX_DIM_CELL_EMPTY);
    qTop[1].qSubNodes[0].qSubNodes = createNodes(1, NxDimCellType.NX_DIM_CELL_EMPTY);

    qTop[2].qSubNodes = createNodes(subNodesCount, NxDimCellType.NX_DIM_CELL_NORMAL);
    qTop[2].qSubNodes[0].qSubNodes = createNodes(1, NxDimCellType.NX_DIM_CELL_EMPTY);
    qTop[2].qSubNodes[1].qSubNodes = createNodes(2, NxDimCellType.NX_DIM_CELL_NORMAL);

    const top = extractTopGrid(grid, qTop, qArea, layoutService);

    expect(top).toMatchSnapshot();
  });

  test("should extract top data when in snapshot mode", () => {
    layoutService.isSnapshot = true;
    const colCount = 3;
    const qTop = createNodes(colCount, NxDimCellType.NX_DIM_CELL_NORMAL);

    const top = extractTopGrid(grid, qTop, qArea, layoutService);

    expect(top).toMatchSnapshot();
  });
});
