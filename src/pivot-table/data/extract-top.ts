import { NxPageArea, NxPivotDimensionCell } from "../../types/QIX";
import { CellValue } from "../../types/types";

const extractTop = (qTop: NxPivotDimensionCell[], qArea: NxPageArea): CellValue[][] => {
  let colIdx = 0;
  if (!qTop.length) {
    return [];
  }

  function extract(nodes: NxPivotDimensionCell[], matrix: CellValue[][] = [], topRowIdx = 0): CellValue[][] {
    if (!matrix.length) {
      matrix.push(...Array(qArea.qWidth)
        .fill(null)
        .map(() => [null])
      );
    }

    if (Array.isArray(matrix[colIdx+1]) && matrix[colIdx+1].length - 1 < topRowIdx) {
      matrix.forEach((col) => {
        col.push(null);
      });
    }

    return nodes.reduce((mtrx: CellValue[][], node: NxPivotDimensionCell, currIdx: number) => {
      colIdx += currIdx === 0 ? 0 : 1;
      mtrx[colIdx][topRowIdx] = node; // eslint-disable-line no-param-reassign

      if (node.qSubNodes.length) {
        return extract(node.qSubNodes, mtrx, topRowIdx + 1);
      }

      return mtrx;
    }, matrix);
  };

  return extract(qTop);
};

export default extractTop;
