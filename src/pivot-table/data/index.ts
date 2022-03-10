import NxDimCellType from '../../types/QIX';
import { CellValue, PivotData, PivotDimensionCellWithPosition } from '../../types/types';
import extractHeaders from './extract-headers';
import extractLeft from './extract-left';
import extractTop from './extract-top';

const getColumnCount = (matrix: CellValue[][]): number => matrix.length;

const getRowCount = (matrix: CellValue[][]): number => matrix[0]?.length || 0;

const getTopColumnCount = (matrix: PivotDimensionCellWithPosition[][]): number => matrix[matrix.length - 1]?.length || 0;

const getTopRowCount = (matrix: PivotDimensionCellWithPosition[][]): number => matrix.length;

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
  qDimensionInfo: EngineAPI.INxDimensionInfo[],
  qMeasureInfo: EngineAPI.INxMeasureInfo[],
  ): PivotData {
  const {
    qLeft,
    qArea,
    qTop,
    qData } = dataPage;
  const left = extractLeft(qLeft, qArea.qHeight);
  const top = extractTop(qTop);
  const headers = extractHeaders(qDimensionInfo, getTopRowCount(top), getColumnCount(left));
  const measureInfoIndexMap = (top[top.length - 1] || []).map(cell => {
    const { qText } = findParentPseudoDimension(cell) || {};
    const idx = qMeasureInfo.findIndex(measureInfo => measureInfo.qFallbackTitle ===  qText);
    if (idx === -1) {
      return 0; // Fallback solution when there is only a single measure, as in no pseudo dimenions.
    };

    return idx;
  });
  const pivotData: PivotData = {
    left,
    top,
    data: qData as unknown as EngineAPI.INxPivotValuePoint[][],
    headers,
    measureInfoIndexMap,
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
        x: getColumnCount(left),
        y: getRowCount(left)
      },
      data: {
        x: qArea.qWidth,
        y: qArea.qHeight
      },
      totalRows: getTopRowCount(top) + qArea.qHeight,
      totalColumns: getColumnCount(left) + qArea.qWidth,
    }
  };
console.debug(pivotData);
  return pivotData;
}
