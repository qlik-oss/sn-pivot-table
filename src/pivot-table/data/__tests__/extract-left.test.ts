import NxDimCellType from '../../../types/QIX';
import extractLeft from '../extract-left';
import createNodes from './test-helper';

describe('extractLeft', () => {
  test('should handle empty qLeft array', () => {
    const qLeft: EngineAPI.INxPivotDimensionCell[] = [];

    const left = extractLeft(qLeft);

    expect(left).toHaveLength(0);
  });

  test('should extract left data with no nodes expanded', () => {
    const rowCount = 3;
    const qLeft = createNodes(rowCount, NxDimCellType.NX_DIM_CELL_NORMAL);
    const left = extractLeft(qLeft);

    expect(left).toMatchSnapshot();
  });

  test('should extract left data with first node expanded', () => {
    const rowCount = 3;
    const subNodesCount = 2;
    const qLeft = createNodes(rowCount, NxDimCellType.NX_DIM_CELL_NORMAL);
    const subNodes = createNodes(subNodesCount, NxDimCellType.NX_DIM_CELL_NORMAL);
    qLeft[0].qSubNodes = subNodes;
    qLeft[0].qCanCollapse = true;
    const left = extractLeft(qLeft);

    expect(left).toMatchSnapshot();
  });

  test('should extract left data when data tree has a depth of 2', () => {
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

    const left = extractLeft(qLeft);

    expect(left).toMatchSnapshot();
  });
});
