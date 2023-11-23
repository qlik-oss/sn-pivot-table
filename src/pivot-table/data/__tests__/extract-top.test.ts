import NxDimCellType from "../../../types/QIX";
import type { AttrExprInfoIndex, Cell, LayoutService, VisibleDimensionInfo } from "../../../types/types";
import extractTopGrid from "../extract-top";
import createNodes, { createDimInfo } from "./test-helper";

describe("extractTop", () => {
  let headerRows: number;
  let layoutService: LayoutService;
  const attrExprInfoIndexes: AttrExprInfoIndex[] = [];
  const qArea = { qLeft: 1 } as EngineAPI.INxDataAreaPage;
  const grid = [] as Cell[][];

  const visibleTopDimensionInfo: VisibleDimensionInfo[] = [];

  beforeEach(() => {
    headerRows = 3;
    layoutService = {
      isSnapshot: false,
      getDimensionInfoIndex: () => 0,
      getDimensionInfo: () => createDimInfo(1),
    } as unknown as LayoutService;
  });

  test("should handle empty qTop array", () => {
    headerRows = 1;
    const qTop: EngineAPI.INxPivotDimensionCell[] = [];

    const top = extractTopGrid(
      grid,
      qTop,
      qArea,
      layoutService,
      visibleTopDimensionInfo,
      attrExprInfoIndexes,
      headerRows,
    );

    expect(top).toHaveLength(0);
  });

  test("should extract top data with no nodes expanded", () => {
    const colCount = 3;
    headerRows = 1;
    const qTop = createNodes(colCount, NxDimCellType.NX_DIM_CELL_NORMAL);

    const top = extractTopGrid(
      grid,
      qTop,
      qArea,
      layoutService,
      visibleTopDimensionInfo,
      attrExprInfoIndexes,
      headerRows,
    );

    expect(top).toMatchSnapshot();
  });

  test("should extract top data with an empty row", () => {
    const colCount = 3;
    headerRows = 2;
    const qTop = createNodes(colCount, NxDimCellType.NX_DIM_CELL_NORMAL);

    const top = extractTopGrid(
      grid,
      qTop,
      qArea,
      layoutService,
      visibleTopDimensionInfo,
      attrExprInfoIndexes,
      headerRows,
    );

    expect(top[1]).toEqual({});
    expect(top).toMatchSnapshot();
  });

  test("should extract top data with first node expanded", () => {
    const colCount = 3;
    const subNodesCount = 2;
    headerRows = 2;
    const qTop = createNodes(colCount, NxDimCellType.NX_DIM_CELL_NORMAL);
    const subNodes = createNodes(subNodesCount, NxDimCellType.NX_DIM_CELL_NORMAL);
    qTop[0].qSubNodes = subNodes;
    qTop[0].qCanCollapse = true;

    const top = extractTopGrid(
      grid,
      qTop,
      qArea,
      layoutService,
      visibleTopDimensionInfo,
      attrExprInfoIndexes,
      headerRows,
    );

    expect(top).toMatchSnapshot();
  });

  test("should extract top data when data tree has a depth of 2", () => {
    const colCount = 3;
    const subNodesCount = 2;
    headerRows = 3;
    const qTop = createNodes(colCount, NxDimCellType.NX_DIM_CELL_NORMAL);
    qTop[0].qSubNodes = createNodes(1, NxDimCellType.NX_DIM_CELL_EMPTY);
    qTop[0].qSubNodes[0].qSubNodes = createNodes(1, NxDimCellType.NX_DIM_CELL_EMPTY);

    qTop[1].qSubNodes = createNodes(1, NxDimCellType.NX_DIM_CELL_EMPTY);
    qTop[1].qSubNodes[0].qSubNodes = createNodes(1, NxDimCellType.NX_DIM_CELL_EMPTY);

    qTop[2].qSubNodes = createNodes(subNodesCount, NxDimCellType.NX_DIM_CELL_NORMAL);
    qTop[2].qSubNodes[0].qSubNodes = createNodes(1, NxDimCellType.NX_DIM_CELL_EMPTY);
    qTop[2].qSubNodes[1].qSubNodes = createNodes(2, NxDimCellType.NX_DIM_CELL_NORMAL);

    const top = extractTopGrid(
      grid,
      qTop,
      qArea,
      layoutService,
      visibleTopDimensionInfo,
      attrExprInfoIndexes,
      headerRows,
    );

    expect(top).toMatchSnapshot();
  });

  test("should extract top data when in snapshot mode", () => {
    layoutService.isSnapshot = true;
    const colCount = 3;
    const qTop = createNodes(colCount, NxDimCellType.NX_DIM_CELL_NORMAL);

    const top = extractTopGrid(
      grid,
      qTop,
      qArea,
      layoutService,
      visibleTopDimensionInfo,
      attrExprInfoIndexes,
      headerRows,
    );

    expect(top).toMatchSnapshot();
  });
});
