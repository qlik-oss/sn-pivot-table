import { NxDimCellType, NxPivotDimensionCell } from '../../../types/QIX';
import extractTop from '../extract-top';
import createNodes from './test-helper';

describe('extractTop', () => {
  test('should handle empty qTop array', () => {
    const qTop: NxPivotDimensionCell[] = [];

    const top = extractTop(qTop, 1);

    expect(top).toHaveLength(0);
  });

  test('should extract top data with no nodes expanded', () => {
    const colCount = 3;
    const rowCount = 1;
    const qTop = createNodes(colCount, NxDimCellType.NX_DIM_CELL_NORMAL);

    const top = extractTop(qTop, colCount);

    expect(top).toHaveLength(colCount);
    expect(top[0]).toHaveLength(rowCount);
    expect(top[1]).toHaveLength(rowCount);
    expect(top[2]).toHaveLength(rowCount);
    expect(top[0][0]).toMatchObject({ qElemNo: 0 });
    expect(top[1][0]).toMatchObject({ qElemNo: 1 });
    expect(top[2][0]).toMatchObject({ qElemNo: 2 });
  });

  test('should extract top data with first node expanded', () => {
    const colCount = 3;
    const rowCount = 2;
    const subNodesCount = 2;
    const qTop = createNodes(colCount, NxDimCellType.NX_DIM_CELL_NORMAL);
    const subNodes = createNodes(subNodesCount, NxDimCellType.NX_DIM_CELL_NORMAL);
    qTop[0].qSubNodes = subNodes;
    qTop[0].qCanCollapse = true;
    const totalColCount = colCount + subNodesCount - 1;

    const top = extractTop(qTop, totalColCount);

    expect(top).toHaveLength(totalColCount);
    expect(top[0]).toHaveLength(rowCount);
    expect(top[0][0]).toMatchObject({ qElemNo: 0 });
    expect(top[1][0]).toBe(null);
    expect(top[2][0]).toMatchObject({ qElemNo: 1 });
    expect(top[3][0]).toMatchObject({ qElemNo: 2 });

    expect(top[0][1]).toMatchObject({ qElemNo: 0 });
    expect(top[1][1]).toMatchObject({ qElemNo: 1 });
    expect(top[2][1]).toBeNull();
    expect(top[3][1]).toBeNull();
  });

  test('should extract top data when data tree has a depth of 2', () => {
    const colCount = 3;
    const rowCount = 3;
    const subNodesCount = 2;
    const qTop = createNodes(colCount, NxDimCellType.NX_DIM_CELL_NORMAL);
    qTop[0].qSubNodes = createNodes(1, NxDimCellType.NX_DIM_CELL_EMPTY);
    qTop[0].qSubNodes[0].qSubNodes = createNodes(1, NxDimCellType.NX_DIM_CELL_EMPTY);

    qTop[1].qSubNodes = createNodes(1, NxDimCellType.NX_DIM_CELL_EMPTY);
    qTop[1].qSubNodes[0].qSubNodes = createNodes(1, NxDimCellType.NX_DIM_CELL_EMPTY);

    qTop[2].qSubNodes = createNodes(subNodesCount, NxDimCellType.NX_DIM_CELL_NORMAL);
    qTop[2].qSubNodes[0].qSubNodes = createNodes(1, NxDimCellType.NX_DIM_CELL_EMPTY);
    qTop[2].qSubNodes[1].qSubNodes = createNodes(2, NxDimCellType.NX_DIM_CELL_NORMAL);

    const totalColCount = colCount + (subNodesCount - 1) + (subNodesCount - 1);

    const top = extractTop(qTop, totalColCount);

    expect(top).toHaveLength(totalColCount);
    expect(top[0]).toHaveLength(rowCount);
    expect(top[0][0]).toMatchObject({ qElemNo: 0, qType: NxDimCellType.NX_DIM_CELL_NORMAL });
    expect(top[1][0]).toMatchObject({ qElemNo: 1, qType: NxDimCellType.NX_DIM_CELL_NORMAL });
    expect(top[2][0]).toMatchObject({ qElemNo: 2, qType: NxDimCellType.NX_DIM_CELL_NORMAL });
    expect(top[3][0]).toBeNull();
    expect(top[4][0]).toBeNull();

    expect(top[0][1]).toMatchObject({ qElemNo: 0, qType: NxDimCellType.NX_DIM_CELL_EMPTY });
    expect(top[1][1]).toMatchObject({ qElemNo: 0, qType: NxDimCellType.NX_DIM_CELL_EMPTY });
    expect(top[2][1]).toMatchObject({ qElemNo: 0, qType: NxDimCellType.NX_DIM_CELL_NORMAL });
    expect(top[3][1]).toMatchObject({ qElemNo: 1, qType: NxDimCellType.NX_DIM_CELL_NORMAL });
    expect(top[4][1]).toBeNull();

    expect(top[0][2]).toMatchObject({ qElemNo: 0, qType: NxDimCellType.NX_DIM_CELL_EMPTY });
    expect(top[1][2]).toMatchObject({ qElemNo: 0, qType: NxDimCellType.NX_DIM_CELL_EMPTY });
    expect(top[2][2]).toMatchObject({ qElemNo: 0, qType: NxDimCellType.NX_DIM_CELL_EMPTY });
    expect(top[3][2]).toMatchObject({ qElemNo: 0, qType: NxDimCellType.NX_DIM_CELL_NORMAL });
    expect(top[4][2]).toMatchObject({ qElemNo: 1, qType: NxDimCellType.NX_DIM_CELL_NORMAL });
  });
});
