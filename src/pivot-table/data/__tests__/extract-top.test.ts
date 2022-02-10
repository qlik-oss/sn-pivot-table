import { NxDimCellType, NxPivotDimensionCell } from '../../../types/QIX';
import extractTop from '../extract-top';

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

describe('extractTop', () => {
  test('should handle empty qTop array', () => {
    const qTop: NxPivotDimensionCell[] = [];

    const top = extractTop(qTop, 1, 1);

    expect(top).toHaveLength(0);
  });

  test('should extract top data with no nodes expanded', () => {
    const colCount = 3;
    const rowCount = 1;
    const qTop = Array.from({ length: colCount}, (_, idx: number) => createNode(idx));

    const top = extractTop(qTop, colCount, rowCount);

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
    const qTop = Array.from({ length: colCount}, (_, idx: number) => createNode(idx));
    const subNodes = Array.from({ length: subNodesCount}, (_, idx: number) => createNode(idx));
    qTop[0].qSubNodes = subNodes;
    qTop[0].qCanCollapse = true;
    const totalColCount = colCount + subNodesCount - 1;

    const top = extractTop(qTop, totalColCount, rowCount);

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
    const qTop = Array.from({ length: colCount}, (_, idx: number) => createNode(idx));
    const subNodes = Array.from({ length: subNodesCount}, (_, idx: number) => createNode(idx));
    const subSubNodes = Array.from({ length: subNodesCount}, (_, idx: number) => createNode(idx));
    subNodes[1].qSubNodes = subSubNodes;
    subNodes[1].qCanCollapse = true;
    qTop[2].qSubNodes = subNodes;
    qTop[2].qCanCollapse = true;
    const totalColCount = colCount + (subNodesCount - 1) + (subNodesCount - 1);

    const top = extractTop(qTop, totalColCount, rowCount);

    expect(top).toHaveLength(totalColCount);
    expect(top[0]).toHaveLength(rowCount);
    expect(top[0][0]).toMatchObject({ qElemNo: 0 });
    expect(top[1][0]).toMatchObject({ qElemNo: 1 });
    expect(top[2][0]).toMatchObject({ qElemNo: 2 });
    expect(top[3][0]).toBe(null);
    expect(top[4][0]).toBe(null);

    expect(top[0][1]).toBeNull();
    expect(top[1][1]).toBeNull();
    expect(top[2][1]).toMatchObject({ qElemNo: 0 });
    expect(top[3][1]).toMatchObject({ qElemNo: 1 });
    expect(top[4][1]).toBe(null);

    expect(top[0][2]).toBeNull();
    expect(top[1][2]).toBeNull();
    expect(top[2][2]).toBeNull();
    expect(top[3][2]).toMatchObject({ qElemNo: 0 });
    expect(top[4][2]).toMatchObject({ qElemNo: 1 });
  });
});
