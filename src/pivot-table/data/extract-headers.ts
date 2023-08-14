import { PSEUDO_DIMENSION_INDEX } from "../../constants";
import type { ExtendedDimensionInfo, HyperCube } from "../../types/QIX";
import type { HeaderTitle } from "../../types/types";

const extractHeaders = (
  hyperCube: HyperCube,
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
        sortDirection: "A",
        isColumnSorted: false,
        fieldId: "",
        activelySortedColumnIndex: false,
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
        // TODO:
        // think about removing this
        isColumnSorted: hyperCube.qEffectiveInterColumnSortOrder[0] === dimIndex,
        qLibraryId: dimInfo.qLibraryId,
        fieldId: dimInfo.qGroupFieldDefs[dimInfo.qGroupPos],
        activelySortedColumnIndex: dimIndex === (hyperCube.activelySortedColumnIndex || 0),
      };
    }
  });

  return matrix;
};

export default extractHeaders;
