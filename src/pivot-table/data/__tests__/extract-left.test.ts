import { NxDimCellType, NxPivotDimensionCell } from '../../../types/QIX';
import extractLeft from '../extract-left';

function createNode(qElemNo: number): NxPivotDimensionCell {
  return {
    qType: NxDimCellType.NX_DIM_CELL_NORMAL,
    qElemNo,
    qCanCollapse: false,
    qCanExpand: false,
    qSubNodes: [],
    qText: '',
    qValue: '',
    qUp: 0,
    qDown: 0,
  };
}

describe('extractLeft', () => {
  test('should handle empty qLeft array', () => {
    const qLeft: NxPivotDimensionCell[] = [];

    const left = extractLeft(qLeft, 1, 1);

    expect(left).toHaveLength(0);
  });

  test('should extract left data with no nodes expanded', () => {
    const rowCount = 3;
    const qLeft = Array.from({ length: rowCount}, (_, idx: number) => createNode(idx));
    const left = extractLeft(qLeft, rowCount, 1);

    expect(left).toHaveLength(1);
    expect(left[0]).toHaveLength(rowCount);
    expect(left[0][0]).toMatchObject({ qElemNo: 0 });
    expect(left[0][1]).toMatchObject({ qElemNo: 1 });
    expect(left[0][2]).toMatchObject({ qElemNo: 2 });
  });

  test('should extract left data with first node expanded', () => {
    const columnCount = 2;
    const rowCount = 3;
    const subNodesCount = 2;
    const qLeft = Array.from({ length: rowCount}, (_, idx: number) => createNode(idx));
    const subNodes = Array.from({ length: subNodesCount}, (_, idx: number) => createNode(idx));
    qLeft[0].qSubNodes = subNodes;
    qLeft[0].qCanCollapse = true;
    const totalRowCount = rowCount + subNodesCount - 1;
    const left = extractLeft(qLeft, totalRowCount, columnCount);

    expect(left).toHaveLength(columnCount);
    expect(left[0]).toHaveLength(totalRowCount);
    expect(left[0][0]).toMatchObject({ qElemNo: 0 });
    expect(left[0][1]).toBe(null);
    expect(left[0][2]).toMatchObject({ qElemNo: 1 });
    expect(left[0][3]).toMatchObject({ qElemNo: 2 });

    expect(left[1][0]).toMatchObject({ qElemNo: 0 });
    expect(left[1][1]).toMatchObject({ qElemNo: 1 });
    expect(left[1][2]).toBeNull();
    expect(left[1][3]).toBeNull();
  });

  test('should extract left data when data tree has a depth of 2', () => {
    const columnCount = 3;
    const rowCount = 3;
    const subNodesCount = 2;
    const qLeft = Array.from({ length: rowCount}, (_, idx: number) => createNode(idx));
    const subNodes = Array.from({ length: subNodesCount}, (_, idx: number) => createNode(idx));
    const subSubNodes = Array.from({ length: subNodesCount}, (_, idx: number) => createNode(idx));
    subNodes[1].qSubNodes = subSubNodes;
    subNodes[1].qCanCollapse = true;
    qLeft[2].qSubNodes = subNodes;
    qLeft[2].qCanCollapse = true;
    const totalRowCount = rowCount + (subNodesCount - 1) + (subNodesCount - 1);
    const left = extractLeft(qLeft, totalRowCount, columnCount);

    expect(left).toHaveLength(columnCount);
    expect(left[0]).toHaveLength(totalRowCount);
    expect(left[0][0]).toMatchObject({ qElemNo: 0 });
    expect(left[0][1]).toMatchObject({ qElemNo: 1 });
    expect(left[0][2]).toMatchObject({ qElemNo: 2 });
    expect(left[0][3]).toBe(null);
    expect(left[0][4]).toBe(null);

    expect(left[1][0]).toBeNull();
    expect(left[1][1]).toBeNull();
    expect(left[1][2]).toMatchObject({ qElemNo: 0 });
    expect(left[1][3]).toMatchObject({ qElemNo: 1 });
    expect(left[1][4]).toBe(null);

    expect(left[2][0]).toBeNull();
    expect(left[2][1]).toBeNull();
    expect(left[2][2]).toBeNull();
    expect(left[2][3]).toMatchObject({ qElemNo: 0 });
    expect(left[2][4]).toMatchObject({ qElemNo: 1 });
  });
});
