import { NxDimCellType, NxPivotDimensionCell } from '../../../types/QIX';
import extractLeft from '../extract-left';
import createNodes from './test-helper';

describe('extractLeft', () => {
  test('should handle empty qLeft array', () => {
    const qLeft: NxPivotDimensionCell[] = [];

    const left = extractLeft(qLeft, 1);

    expect(left).toHaveLength(0);
  });

  test('should extract left data with no nodes expanded', () => {
    const rowCount = 3;
    const qLeft = createNodes(rowCount, NxDimCellType.NX_DIM_CELL_NORMAL);
    const left = extractLeft(qLeft, rowCount);

    expect(left).toHaveLength(1);
    expect(left[0]).toHaveLength(rowCount);
    expect(left[0][0]).toMatchObject({ qElemNo: 0, qType: NxDimCellType.NX_DIM_CELL_NORMAL });
    expect(left[0][1]).toMatchObject({ qElemNo: 1, qType: NxDimCellType.NX_DIM_CELL_NORMAL });
    expect(left[0][2]).toMatchObject({ qElemNo: 2, qType: NxDimCellType.NX_DIM_CELL_NORMAL });
  });

  test('should extract left data with first node expanded', () => {
    const columnCount = 2;
    const rowCount = 3;
    const subNodesCount = 2;
    const qLeft = createNodes(rowCount, NxDimCellType.NX_DIM_CELL_NORMAL);
    const subNodes = createNodes(subNodesCount, NxDimCellType.NX_DIM_CELL_NORMAL);
    qLeft[0].qSubNodes = subNodes;
    qLeft[0].qCanCollapse = true;
    const totalRowCount = rowCount + subNodesCount - 1;
    const left = extractLeft(qLeft, totalRowCount);

    expect(left).toHaveLength(columnCount);
    expect(left[0]).toHaveLength(totalRowCount);
    expect(left[0][0]).toMatchObject({ qElemNo: 0, qType: NxDimCellType.NX_DIM_CELL_NORMAL });
    expect(left[0][1]).toBe(null);
    expect(left[0][2]).toMatchObject({ qElemNo: 1, qType: NxDimCellType.NX_DIM_CELL_NORMAL });
    expect(left[0][3]).toMatchObject({ qElemNo: 2, qType: NxDimCellType.NX_DIM_CELL_NORMAL });

    expect(left[1][0]).toMatchObject({ qElemNo: 0, qType: NxDimCellType.NX_DIM_CELL_NORMAL });
    expect(left[1][1]).toMatchObject({ qElemNo: 1, qType: NxDimCellType.NX_DIM_CELL_NORMAL });
    expect(left[1][2]).toBeNull();
    expect(left[1][3]).toBeNull();
  });

  test('should extract left data when data tree has a depth of 2', () => {
    const columnCount = 3;
    const rowCount = 3;
    const subNodesCount = 2;
    const qLeft = createNodes(rowCount, NxDimCellType.NX_DIM_CELL_NORMAL);

    qLeft[0].qSubNodes = createNodes(1, NxDimCellType.NX_DIM_CELL_EMPTY);
    qLeft[0].qSubNodes[0].qSubNodes = createNodes(1, NxDimCellType.NX_DIM_CELL_EMPTY);

    qLeft[1].qSubNodes = createNodes(1, NxDimCellType.NX_DIM_CELL_EMPTY);
    qLeft[1].qSubNodes[0].qSubNodes = createNodes(1, NxDimCellType.NX_DIM_CELL_EMPTY);

    qLeft[2].qSubNodes = createNodes(subNodesCount, NxDimCellType.NX_DIM_CELL_NORMAL);
    qLeft[2].qSubNodes[0].qSubNodes = createNodes(1, NxDimCellType.NX_DIM_CELL_EMPTY);
    qLeft[2].qCanCollapse = true;
    qLeft[2].qSubNodes[1].qSubNodes = createNodes(subNodesCount, NxDimCellType.NX_DIM_CELL_NORMAL);;
    qLeft[2].qSubNodes[1].qCanCollapse = true;

    const totalRowCount = rowCount + (subNodesCount - 1) + (subNodesCount - 1);
    const left = extractLeft(qLeft, totalRowCount);

    expect(left).toHaveLength(columnCount);
    expect(left[0]).toHaveLength(totalRowCount);
    expect(left[0][0]).toMatchObject({ qElemNo: 0, qType: NxDimCellType.NX_DIM_CELL_NORMAL });
    expect(left[0][1]).toMatchObject({ qElemNo: 1, qType: NxDimCellType.NX_DIM_CELL_NORMAL });
    expect(left[0][2]).toMatchObject({ qElemNo: 2, qType: NxDimCellType.NX_DIM_CELL_NORMAL });
    expect(left[0][3]).toBeNull();
    expect(left[0][4]).toBeNull();

    expect(left[1][0]).toBeNull();
    expect(left[1][1]).toBeNull();
    expect(left[1][2]).toMatchObject({ qElemNo: 0, qType: NxDimCellType.NX_DIM_CELL_NORMAL });
    expect(left[1][3]).toMatchObject({ qElemNo: 1, qType: NxDimCellType.NX_DIM_CELL_NORMAL });
    expect(left[1][4]).toBeNull();

    expect(left[2][0]).toBeNull();
    expect(left[2][1]).toBeNull();
    expect(left[2][2]).toBeNull();
    expect(left[2][3]).toMatchObject({ qElemNo: 0, qType: NxDimCellType.NX_DIM_CELL_NORMAL });
    expect(left[2][4]).toMatchObject({ qElemNo: 1, qType: NxDimCellType.NX_DIM_CELL_NORMAL });
  });
});
