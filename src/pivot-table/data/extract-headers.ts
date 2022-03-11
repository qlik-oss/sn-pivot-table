import { PSEUDO_DIMENSION_INDEX } from '../../constants';

const extractHeaders = (qDim: EngineAPI.INxDimensionInfo[], rowCount: number, dimensionInfoIndex: number[]): (null|string)[][] => {
  const matrix = Array(dimensionInfoIndex.length)
    .fill(null)
    .map(() => Array(rowCount).fill(null));

    dimensionInfoIndex.forEach((dimIndex, colIdx) => {
    if (dimIndex === PSEUDO_DIMENSION_INDEX) {
      matrix[colIdx][rowCount - 1] = '';
    } else {
      matrix[colIdx][rowCount - 1] = qDim[dimIndex].qFallbackTitle;
    }
  });

  return matrix;
};

export default extractHeaders;
