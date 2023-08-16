import { PSEUDO_DIMENSION_INDEX } from "../../constants";
import type { HyperCube } from "../../types/QIX";
import type { HeaderTitle, VisibleDimensionInfo } from "../../types/types";
import getKey from "../components/helpers/get-key";

const extractHeaders = (
  hyperCube: HyperCube,
  rowCount: number,
  visibleLeftDimensionInfo: VisibleDimensionInfo[]
): (null | HeaderTitle)[][] => {
  const matrix: (null | HeaderTitle)[][] = Array(visibleLeftDimensionInfo.length)
    .fill(null)
    .map(() => Array.from({ length: rowCount }, () => null));

  visibleLeftDimensionInfo.forEach((qDimensionInfo, colIdx) => {
    if (qDimensionInfo === PSEUDO_DIMENSION_INDEX) {
      matrix[colIdx][rowCount - 1] = {
        id: "PSEUDO-DIM",
        colIdx: -1,
        title: "",
        sortDirection: "A",
        fieldId: "",
        isActivelySorted: false,
      };
    } else {
      const id: string = getKey(qDimensionInfo);
      matrix[colIdx][rowCount - 1] = {
        id,
        colIdx: colIdx, // TODO: find index here
        title: qDimensionInfo.qFallbackTitle,
        qReverseSort: qDimensionInfo?.qReverseSort,
        sortDirection:
          qDimensionInfo.qSortIndicator && qDimensionInfo.qSortIndicator !== "N" ? qDimensionInfo.qSortIndicator : "A",
        qLibraryId: qDimensionInfo.qLibraryId,
        fieldId: qDimensionInfo.qGroupFieldDefs[qDimensionInfo.qGroupPos],
        isActivelySorted: colIdx === (hyperCube.activelySortedColumn?.colIdx || 0), // TODO: find index here
      };
    }
  });

  return matrix;
};

export default extractHeaders;
