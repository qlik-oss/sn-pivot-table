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

const createMeasureInfoIndexMap = (top: PivotDimensionCellWithPosition[][], qMeasureInfo: EngineAPI.INxMeasureInfo[]) => (top[top.length - 1] || []).map(cell => {
  const { qText } = findParentPseudoDimension(cell) || {};
  const idx = qMeasureInfo.findIndex(measureInfo => measureInfo.qFallbackTitle ===  qText);
  if (idx === -1) {
    return 0; // Fallback solution when there is only a single measure, as in no pseudo dimenions.
  };

  return idx;
});

export const appendData = (pivotData: PivotData, dataPage: EngineAPI.INxPivotPage): void => {
  const {
    qLeft,
    qTop,
    qData
  } = dataPage;
  // console.log('newDAtaPage', dataPage);
  const left = extractLeft(qLeft);
  // const top = extractTop(qTop);
  console.log('newLeft', left);
  pivotData.left.forEach((column, index) => {
    column.push(...left[index].slice(1));
  });

  // pivotData.top.forEach((row, index) => {
  //   row.push(...top[index]);
  // });

  pivotData.data.push(...(qData as unknown as EngineAPI.INxPivotValuePoint[][]));

  console.log('appendData', pivotData);
};

export const appendTopData = (pivotData: PivotData, dataPage: EngineAPI.INxPivotPage, qHyperCube: EngineAPI.IHyperCube): PivotData => {
  const {
    qTop,
    qData,
    qArea,
  } = dataPage;
  // console.log('newDAtaPage', dataPage);
  const top = extractTop(qTop);
  console.log('newTop', qTop);
  pivotData.top.forEach((row, index) => {
    row.push(...top[index].slice(top[index][0].qUp === 0 ? 0 : 1));
  });
console.log('data length', pivotData.data[0].length);
  pivotData.data.forEach((row, index) => {
    row.push(...(qData as unknown as EngineAPI.INxPivotValuePoint[][])[index]);
  });

  pivotData.size.data.x = qArea.qLeft + qArea.qWidth;
  pivotData.size.data.y = qArea.qTop + qArea.qHeight;
  pivotData.size.top.x = getTopColumnCount(pivotData.top);
  pivotData.size.top.y = getTopRowCount(pivotData.top);
  pivotData.size.totalRows = pivotData.size.top.y + pivotData.size.data.y;
  pivotData.size.totalColumns = getLeftColumnCount(pivotData.left) + pivotData.size.data.x;

  const measureInfoIndexMap = createMeasureInfoIndexMap(top, qHyperCube.qMeasureInfo);

  pivotData.measureInfoIndexMap.push(...measureInfoIndexMap);
if (pivotData.measureInfoIndexMap.length !== pivotData.data[0].length) {
  console.warn('miss-matching length', pivotData.measureInfoIndexMap.length, pivotData.data[0].length, pivotData.top[pivotData.top.length - 1].length);
}
  console.log('appendData', pivotData);

  return pivotData;
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
    data: [...(qData as unknown as EngineAPI.INxPivotValuePoint[][])],
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
      totalColumns: getLeftColumnCount(left) + qArea.qWidth,
    }
  };

  return pivotData;
}
