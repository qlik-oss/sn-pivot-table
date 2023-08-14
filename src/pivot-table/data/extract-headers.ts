import { PSEUDO_DIMENSION_INDEX } from "../../constants";
import type { ExtendedDimensionInfo } from "../../types/QIX";
import type { HeaderTitle } from "../../types/types";

const extractHeaders = (
  hyperCube: EngineAPI.IHyperCube,
  rowCount: number,
  dimensionInfoIndex: number[]
): (null | HeaderTitle)[][] => {
  const matrix: (null | HeaderTitle)[][] = Array(dimensionInfoIndex.length)
    .fill(null)
    .map(() => Array.from({ length: rowCount }, () => null));

  dimensionInfoIndex.forEach((dimIndex, colIdx) => {
    if (dimIndex === PSEUDO_DIMENSION_INDEX) {
      matrix[colIdx][rowCount - 1] = {
        id: "PSEUDO-DIM",
        colIdx: -1,
        title: "",
        qReverseSort: undefined,
        sortDirection: "A",
        isColumnSorted: false,
      };
    } else {
      const dimInfo = hyperCube.qDimensionInfo[dimIndex] as ExtendedDimensionInfo;
      const id: string = dimInfo.cId ?? dimInfo.qLibraryId ?? `${dimIndex}-${dimInfo.qFallbackTitle}`;
      matrix[colIdx][rowCount - 1] = {
        id,
        colIdx: dimIndex,
        title: dimInfo.qFallbackTitle,
        qReverseSort: dimInfo?.qReverseSort,
        sortDirection: dimInfo.qSortIndicator && dimInfo.qSortIndicator !== "N" ? dimInfo.qSortIndicator : "A",
        isColumnSorted: hyperCube.qEffectiveInterColumnSortOrder[0] === dimIndex,
      };
    }
  });

  return matrix;
};

export default extractHeaders;
