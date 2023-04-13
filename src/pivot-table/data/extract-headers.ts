import { PSEUDO_DIMENSION_INDEX } from "../../constants";

const extractHeaders = (
  qDim: EngineAPI.INxDimensionInfo[],
  rowCount: number,
  dimensionInfoIndex: number[]
): (null | string)[][] => {
  const matrix: (null | string)[][] = Array(dimensionInfoIndex.length)
    .fill(null)
    .map(() => Array.from({ length: rowCount }, () => null));

  dimensionInfoIndex.forEach((dimIndex, colIdx) => {
    const column = matrix[colIdx];
    const dimension = qDim[dimIndex];
    if (column !== undefined && dimension !== undefined) {
      if (dimIndex === PSEUDO_DIMENSION_INDEX) {
        column[rowCount - 1] = "";
      } else {
        column[rowCount - 1] = dimension.qFallbackTitle;
      }
    }
  });

  return matrix;
};

export default extractHeaders;
