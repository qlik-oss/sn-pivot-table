import { CellValue } from '../../types/types';

const extractHeaders = (qDim: EngineAPI.INxDimensionInfo[], rowCount: number, dimensionInfoIndex: number[]): CellValue[][] => {
  const matrix = Array(dimensionInfoIndex.length)
    .fill(null)
    .map(() => Array(rowCount).fill(null));

    dimensionInfoIndex.forEach((dimIndex, colIdx) => {
    if (dimIndex === -1) {
      matrix[colIdx][rowCount - 1] = '';
    } else {
      matrix[colIdx][rowCount - 1] = qDim[dimIndex].qFallbackTitle;
    }
  });

  return matrix;
};

export default extractHeaders;
