import { PSEUDO_DIMENSION_INDEX } from "../../constants";
import type { ExtendedDimensionInfo } from "../../types/QIX";
import type { HeaderTitle } from "../../types/types";

const extractHeaders = (
  qDim: EngineAPI.INxDimensionInfo[],
  rowCount: number,
  dimensionInfoIndex: number[]
): (null | HeaderTitle)[][] => {
  const matrix: (null | HeaderTitle)[][] = Array(dimensionInfoIndex.length)
    .fill(null)
    .map(() => Array.from({ length: rowCount }, () => null));

  dimensionInfoIndex.forEach((dimIndex, colIdx) => {
    if (dimIndex === PSEUDO_DIMENSION_INDEX) {
      matrix[colIdx][rowCount - 1] = { id: "PSEUDO-DIM", title: "" };
    } else {
      const dimInfo = qDim[dimIndex] as ExtendedDimensionInfo;
      const id: string = dimInfo.cId ?? dimInfo.qLibraryId ?? `${dimIndex}-${dimInfo.qFallbackTitle}`;
      matrix[colIdx][rowCount - 1] = { id, title: qDim[dimIndex].qFallbackTitle };
    }
  });

  return matrix;
};

export default extractHeaders;
