import { NxPageArea, NxPivotDimensionCell } from "../../types/QIX";
import { Cell } from "../../types/types";
import createCell from "./cell";

const extractTop = (qTop: Array<NxPivotDimensionCell>, qArea: NxPageArea): Cell[][] => {
  let colIdx = 0;
  if (!qTop.length) {
    return [];
  }

  function extract(nodes: Array<NxPivotDimensionCell>, matrix: Cell[][] = [], topRowIdx = 0): Cell[][] {
    if (!matrix.length) {
      matrix.push(...Array(qArea.qWidth)
        .fill(null)
        .map((value, i) => [createCell(value, `null-${i}-${0}`)])
      );
    }

    if (Array.isArray(matrix[colIdx+1]) && matrix[colIdx+1].length - 1 < topRowIdx) {
      matrix.forEach((col, i) => {
        col.push(createCell(null, `null-${i}-${topRowIdx}`))
      });
    }

    return nodes.reduce((mtrx: Cell[][], node: NxPivotDimensionCell, currIdx: number) => {
      colIdx += currIdx === 0 ? 0 : 1;
      mtrx[colIdx][topRowIdx] = createCell(node, `${node.qType}-${colIdx}-${topRowIdx}-${node.qElemNo}`); // eslint-disable-line no-param-reassign

      if (node.qSubNodes.length) {
        return extract(node.qSubNodes, mtrx, topRowIdx + 1);
      }

      return mtrx;
    }, matrix);
  };

  return extract(qTop);
};

export default extractTop;
