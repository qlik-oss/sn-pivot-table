import { NxPivotDimensionCell } from '../../types/QIX';
import { CellValue } from '../../types/types';
import estimateCount from './estimate-count';

const extractTop = (qTop: NxPivotDimensionCell[], columnCount: number): CellValue[][] => {
  if (!qTop.length) {
    return [];
  }

  let colIdx = 0;
  const rowCount = estimateCount(qTop);
  const nullMatrix = Array(columnCount)
    .fill(null)
    .map(() => Array(rowCount).fill(null));

  function extract(nodes: NxPivotDimensionCell[], matrix: CellValue[][] = [], topRowIdx = 0): CellValue[][] {
    return nodes.reduce((mtrx: CellValue[][], node: NxPivotDimensionCell, currIdx: number) => {
      colIdx += currIdx === 0 ? 0 : 1;
      mtrx[colIdx][topRowIdx] = node; // eslint-disable-line no-param-reassign

      if (node.qSubNodes.length) {
        return extract(node.qSubNodes, mtrx, topRowIdx + 1);
      }

      return mtrx;
    }, matrix);
  };

  return extract(qTop, nullMatrix);
};

export default extractTop;
