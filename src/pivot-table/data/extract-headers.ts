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
  isLastDimension: boolean,
): HeaderCell => {
  const id = getKey(qDimensionInfo);
  const dimensionInfoIndex = layoutService.getDimensionInfoIndex(qDimensionInfo);
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
      isLastDimension,
    };
  }
  return {
    id,
    colIdx: 0, // has to be properly set later, would be incorrect after transposing otherwise
    label: qDimensionInfo.qFallbackTitle,
    qReverseSort: qDimensionInfo.qReverseSort,
    sortDirection:
      qDimensionInfo.qSortIndicator && qDimensionInfo.qSortIndicator !== "N" ? qDimensionInfo.qSortIndicator : "A",
    qLibraryId: qDimensionInfo.qLibraryId,
    fieldId: qDimensionInfo.qGroupFieldDefs[qDimensionInfo.qGroupPos],
    isActivelySorted: false, // has to be properly set later, would be incorrect after transposing otherwise
    isLocked: qDimensionInfo.qLocked ?? false,
    columnWidth: qDimensionInfo.columnWidth,
    qApprMaxGlyphCount: qDimensionInfo.qApprMaxGlyphCount,
    isDim: true,
    headTextAlign: "left",
    dimensionInfoIndex,
    canBeResized: false, // has to be properly set later, would be incorrect after transposing otherwise
    isLeftDimension,
    isLastDimension,
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

  lastRow.forEach((dimensionInfo, colIdx, dimensionInfos) => {
    const isLastDimension = colIdx === dimensionInfos.length - 1;
    matrix[rowCount - 1][colIdx] = createHeaderCell(layoutService, dimensionInfo, isLastDimension);
  });

  prunedLastCol.forEach((dimensionInfo, rowIdx, dimensionInfos) => {
    const isLastDimension = rowIdx === dimensionInfos.length - 1;
    matrix[rowIdx][colCount - 1] = createHeaderCell(layoutService, dimensionInfo, isLastDimension);
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

  // Update canBeResized, isActivelySorted and colIdx on bottom row
  if (matrix.length) {
    for (const [colIdx, cell] of matrix[matrix.length - 1].entries()) {
      if (cell) {
        cell.canBeResized = cell.isLeftDimension;
        cell.isActivelySorted = colIdx === (layoutService.layout.qHyperCube.activelySortedColumn?.colIdx ?? 0);
        cell.colIdx = cell.colIdx || colIdx;
      }
    }
  }

  return matrix;
};

export default extractHeaders;
