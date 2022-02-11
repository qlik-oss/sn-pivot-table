import { NxDimensionInfo } from '../../types/QIX';
import { CellValue } from '../../types/types';

const extractHeaders = (qDim: NxDimensionInfo[], rowCount: number, colCount: number): CellValue[][] => {
  const matrix = Array(colCount)
    .fill(null)
    .map(() => Array(rowCount).fill(null));

  qDim.slice(0, colCount).forEach((info, colIdx) => {
    matrix[colIdx][rowCount - 1] = info.qFallbackTitle;
  });

  return matrix;
};

export default extractHeaders;
