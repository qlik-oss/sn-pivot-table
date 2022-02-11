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
    const qTop = createNodes(colCount, NxDimCellType.NX_DIM_CELL_NORMAL);

    const top = extractTop(qTop, colCount);

    expect(top).toMatchSnapshot();
  });

  test('should extract top data with first node expanded', () => {
    const colCount = 3;
    const subNodesCount = 2;
    const qTop = createNodes(colCount, NxDimCellType.NX_DIM_CELL_NORMAL);
    const subNodes = createNodes(subNodesCount, NxDimCellType.NX_DIM_CELL_NORMAL);
    qTop[0].qSubNodes = subNodes;
    qTop[0].qCanCollapse = true;
    const totalColCount = colCount + subNodesCount - 1;

    const top = extractTop(qTop, totalColCount);

    expect(top).toMatchSnapshot();
  });

  test('should extract top data when data tree has a depth of 2', () => {
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

    const totalColCount = colCount + (subNodesCount - 1) + (subNodesCount - 1);

    const top = extractTop(qTop, totalColCount);

    expect(top).toMatchSnapshot();
  });
});
