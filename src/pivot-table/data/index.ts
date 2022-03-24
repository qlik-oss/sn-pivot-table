import { PSEUDO_DIMENSION_INDEX } from '../../constants';
import NxDimCellType from '../../types/QIX';
import { PivotData, PivotDimensionCellWithPosition } from '../../types/types';
import extractHeaders from './extract-headers';
import extractLeft from './extract-left';
import extractTop from './extract-top';

const getColumnCount = (matrix: unknown[][]): number => matrix.length;

const getRowCount = (matrix: unknown[][]): number => matrix[0]?.length || 0;

const getTopColumnCount = (matrix: PivotDimensionCellWithPosition[][]): number => matrix[matrix.length - 1]?.length || 0;

const getTopRowCount = (matrix: PivotDimensionCellWithPosition[][]): number => matrix.length;

const getLeftRowCount = (matrix: PivotDimensionCellWithPosition[][]): number => matrix[matrix.length - 1]?.length || 0;

const getLeftColumnCount = (matrix: PivotDimensionCellWithPosition[][]): number => matrix.length;

export const findParentPseudoDimension = (cell: PivotDimensionCellWithPosition): PivotDimensionCellWithPosition | null => {
  if (cell.qType === NxDimCellType.NX_DIM_CELL_PSEUDO) return cell;

  let { parent } = cell;

  if (!parent) return parent;

  while (parent.qType !== NxDimCellType.NX_DIM_CELL_PSEUDO) {
    if (parent.parent) {
      parent = parent.parent;
    } else {
      return null;
    }
  }

  return parent;
};

export default function createData(
  dataPage: EngineAPI.INxPivotPage,
  qHyperCube: EngineAPI.IHyperCube,
  ): PivotData {
  const {
    qLeft,
    qArea,
    qTop,
    qData } = dataPage;
  const {
    qDimensionInfo,
    qMeasureInfo,
    qEffectiveInterColumnSortOrder,
  } = qHyperCube;
  const left = extractLeft(qLeft);
  const top = extractTop(qTop);
  const dimensionInfoIndexMap = left.map((column, index) => {
    if (column[0] === null) return qEffectiveInterColumnSortOrder[index];
    if (column[0].qType === NxDimCellType.NX_DIM_CELL_PSEUDO) return PSEUDO_DIMENSION_INDEX;
    return qEffectiveInterColumnSortOrder[index];
  });
  const measureInfoIndexMap = (top[top.length - 1] || []).map(cell => {
    const { qText } = findParentPseudoDimension(cell) || {};
    const idx = qMeasureInfo.findIndex(measureInfo => measureInfo.qFallbackTitle ===  qText);
    if (idx === -1) {
      return 0; // Fallback solution when there is only a single measure, as in no pseudo dimenions.
    };

    return idx;
  });
  const headers = extractHeaders(qDimensionInfo, getTopRowCount(top), dimensionInfoIndexMap);

  const pivotData: PivotData = {
    left,
    top,
    data: qData as unknown as EngineAPI.INxPivotValuePoint[][],
    headers,
    measureInfoIndexMap,
    dimensionInfoIndexMap,
    size: {
      headers: {
        x: getColumnCount(headers),
        y: getRowCount(headers)
      },
      top: {
        x: getTopColumnCount(top),
        y: getTopRowCount(top)
      },
      left: {
        x: getLeftColumnCount(left),
        y: getLeftRowCount(left)
      },
      data: {
        x: qArea.qWidth,
        y: qArea.qHeight
      },
      totalRows: getTopRowCount(top) + qArea.qHeight,
      totalColumns: getColumnCount(left) + qArea.qWidth,
    }
  };

  return pivotData;
}
