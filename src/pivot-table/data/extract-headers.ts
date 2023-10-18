import { PSEUDO_DIMENSION_INDEX } from "../../constants";
import type { ExtendedHyperCube } from "../../types/QIX";
import type { HeaderCell, VisibleDimensionInfo } from "../../types/types";
import getKey from "../components/helpers/get-key";

const extractHeaders = (
  hyperCube: ExtendedHyperCube,
  rowCount: number,
  visibleLeftDimensionInfo: VisibleDimensionInfo[],
): (null | HeaderCell)[][] => {
  const matrix: (null | HeaderCell)[][] = Array(visibleLeftDimensionInfo.length)
    .fill(null)
    .map(() => Array.from({ length: rowCount }, () => null));

  visibleLeftDimensionInfo.forEach((qDimensionInfo, colIdx) => {
    if (qDimensionInfo === PSEUDO_DIMENSION_INDEX) {
      matrix[colIdx][rowCount - 1] = {
        id: "PSEUDO-DIM",
        colIdx: -1,
        label: "",
        sortDirection: "A",
        fieldId: "",
        isActivelySorted: false,
        isLocked: false,
        isDim: false,
        headTextAlign: "left",
      };
    } else {
      const id: string = getKey(qDimensionInfo);
      matrix[colIdx][rowCount - 1] = {
        id,
        colIdx,
        label: qDimensionInfo.qFallbackTitle,
        qReverseSort: qDimensionInfo.qReverseSort,
        sortDirection:
          qDimensionInfo.qSortIndicator && qDimensionInfo.qSortIndicator !== "N" ? qDimensionInfo.qSortIndicator : "A",
        qLibraryId: qDimensionInfo.qLibraryId,
        fieldId: qDimensionInfo.qGroupFieldDefs[qDimensionInfo.qGroupPos],
        isActivelySorted: colIdx === (hyperCube.activelySortedColumn?.colIdx ?? 0),
        isLocked: qDimensionInfo.qLocked ?? false,
        isDim: true,
        headTextAlign: "left",
      };
    }
  });

  return matrix;
};

export default extractHeaders;
