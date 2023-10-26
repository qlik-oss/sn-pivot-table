import { PSEUDO_DIMENSION_INDEX } from "../../constants";
import type { HeaderCell, LayoutService, VisibleDimensionInfo } from "../../types/types";
import getKey from "../components/helpers/get-key";

const extractHeaders = (
  layoutService: LayoutService,
  visibleTopDimensionInfo: VisibleDimensionInfo[],
  visibleLeftDimensionInfo: VisibleDimensionInfo[],
): (null | HeaderCell)[][] => {
  const {
    layout: { qHyperCube },
    getDimensionInfoIndex,
  } = layoutService;

  // rowCount cannot be 0, as it will cause an issue when there is no top data but there is left data
  const rowCount = Math.max(1, visibleTopDimensionInfo.length);
  const matrix: (null | HeaderCell)[][] = Array(rowCount)
    .fill(null)
    .map(() => Array.from({ length: visibleLeftDimensionInfo.length }, () => null));

  visibleLeftDimensionInfo.forEach((qDimensionInfo, colIdx) => {
    const id = getKey(qDimensionInfo);
    if (qDimensionInfo === PSEUDO_DIMENSION_INDEX) {
      matrix[rowCount - 1][colIdx] = {
        id,
        colIdx: -1,
        label: "",
        sortDirection: "A",
        fieldId: "",
        isActivelySorted: false,
        isLocked: false,
        isDim: false,
        headTextAlign: "left",
        dimensionInfoIndex: -1,
      };
    } else {
      matrix[rowCount - 1][colIdx] = {
        id,
        colIdx,
        label: qDimensionInfo.qFallbackTitle,
        qReverseSort: qDimensionInfo.qReverseSort,
        sortDirection:
          qDimensionInfo.qSortIndicator && qDimensionInfo.qSortIndicator !== "N" ? qDimensionInfo.qSortIndicator : "A",
        qLibraryId: qDimensionInfo.qLibraryId,
        fieldId: qDimensionInfo.qGroupFieldDefs[qDimensionInfo.qGroupPos],
        isActivelySorted: colIdx === (qHyperCube.activelySortedColumn?.colIdx ?? 0),
        isLocked: qDimensionInfo.qLocked ?? false,
        columnWidth: qDimensionInfo.columnWidth,
        qApprMaxGlyphCount: qDimensionInfo.qApprMaxGlyphCount,
        isDim: true,
        headTextAlign: "left",
        dimensionInfoIndex: getDimensionInfoIndex(qDimensionInfo),
      };
    }
  });

  return matrix;
};

export default extractHeaders;
