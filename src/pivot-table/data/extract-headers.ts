import { PSEUDO_DIMENSION_INDEX } from "../../constants";
import type { HeaderCell, HeadersDataMatrix, LayoutService, VisibleDimensionInfo } from "../../types/types";
import getKey from "../components/helpers/get-key";

interface CreateMatrixProps {
  layoutService: LayoutService;
  lastCol: VisibleDimensionInfo[];
  lastRow: VisibleDimensionInfo[];
}

const createEmptyMatrix = <T>(rowCount: number, colCount: number): (T | null)[][] =>
  Array(rowCount)
    .fill(null)
    .map(() => Array.from({ length: colCount }, () => null));

const transpose = <T>(matrix: T[][]) => matrix[0].map((_col, i) => matrix.map((row) => row[i]));

const trimTrailingPseudo = (visibleDimensionInfos: VisibleDimensionInfo[]) => {
  if (visibleDimensionInfos.at(-1) === PSEUDO_DIMENSION_INDEX) {
    return visibleDimensionInfos.slice(0, -1);
  }
  return visibleDimensionInfos;
};

const createHeaderCell = (
  layoutService: LayoutService,
  qDimensionInfo: VisibleDimensionInfo,
  colIdx: number,
): HeaderCell => {
  const {
    layout: { qHyperCube },
    getDimensionInfoIndex,
  } = layoutService;

  const id = getKey(qDimensionInfo);
  const dimensionInfoIndex = getDimensionInfoIndex(qDimensionInfo);
  const isLeftDimension = layoutService.isLeftDimension(dimensionInfoIndex);
  if (qDimensionInfo === PSEUDO_DIMENSION_INDEX) {
    return {
      id,
      colIdx: -1,
      label: "",
      sortDirection: "A",
      fieldId: "",
      isActivelySorted: false,
      isLocked: false,
      isDim: false,
      headTextAlign: "left",
      dimensionInfoIndex,
      canBeResized: false,
      isLeftDimension,
    };
  }
  return {
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
    dimensionInfoIndex,
    canBeResized: false,
    isLeftDimension,
  };
};

const createMatrix = ({ layoutService, lastRow, lastCol }: CreateMatrixProps): HeadersDataMatrix => {
  let prunedLastCol = lastCol;
  if (lastRow.length > 0) {
    prunedLastCol = trimTrailingPseudo(lastCol);
  }
  const rowCount = prunedLastCol.length + (lastRow.length ? 1 : 0);
  const colCount = Math.max(1, lastRow.length);
  const matrix: HeadersDataMatrix = createEmptyMatrix(rowCount, colCount);

  lastRow.forEach((dimensionInfo, colIdx) => {
    matrix[rowCount - 1][colIdx] = createHeaderCell(layoutService, dimensionInfo, colIdx);
  });

  prunedLastCol.forEach((dimensionInfo, rowIdx) => {
    matrix[rowIdx][colCount - 1] = createHeaderCell(layoutService, dimensionInfo, colCount - 1);
  });
  return matrix;
};

const extractHeaders = (
  layoutService: LayoutService,
  visibleTopDimensionInfos: VisibleDimensionInfo[],
  visibleLeftDimensionInfos: VisibleDimensionInfo[],
): HeadersDataMatrix => {
  let matrix: HeadersDataMatrix;
  if (visibleTopDimensionInfos.length === 0 || visibleTopDimensionInfos.includes(PSEUDO_DIMENSION_INDEX)) {
    matrix = createMatrix({
      layoutService,
      lastRow: visibleLeftDimensionInfos,
      lastCol: visibleTopDimensionInfos,
    });
  } else {
    matrix = transpose(
      createMatrix({
        layoutService,
        lastRow: visibleTopDimensionInfos,
        lastCol: visibleLeftDimensionInfos,
      }),
    );
  }

  // Update canBeResized on bottom row
  if (matrix.length > 0) {
    for (const cell of matrix[matrix.length - 1]) {
      if (cell?.isLeftDimension) {
        cell.canBeResized = true;
      }
    }
  }

  return matrix;
};

export default extractHeaders;
