import { PSEUDO_DIMENSION_INDEX } from '../../constants';
import NxDimCellType from '../../types/QIX';
import { PivotData, PivotDimensionCellWithPosition } from '../../types/types';
import extractHeaders from './extract-headers';
import extractLeft from './extract-left';
import extractTop from './extract-top';
import appendLeafCount from './helpers/append-leaf-count';
import createMeasureInfoIndexMap from './helpers/create-measure-info-index-map';
import findParentPseudoDimension from './helpers/find-parent-pseudo-dimension';

const getColumnCount = (matrix: unknown[][]): number => matrix.length;

const getRowCount = (matrix: unknown[][]): number => matrix[0]?.length || 0;

const getTopRowCount = (matrix: PivotDimensionCellWithPosition[][]): number => matrix.length;

const getLeftColumnCount = (matrix: PivotDimensionCellWithPosition[][]): number => matrix.length;

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

export const appendTopData = (pivotData: PivotData, newDataPage: EngineAPI.INxPivotPage, qHyperCube: EngineAPI.IHyperCube): PivotData => {
  const {
    qTop,
    qData,
    qArea,
  } = newDataPage;
  const top = extractTop(qTop);
  const newTop = pivotData.top.map((row, index) => [...row, ...top[index].slice(top[index][0].qUp === 0 ? 0 : 1)]);
  const lastTopRow = newTop[newTop.length - 1];
  appendLeafCount(newTop, lastTopRow);

  const newData = pivotData.data.map((row, index) => [...row, ...(qData as unknown as EngineAPI.INxPivotValuePoint[][])[index]]);

  const measureInfoIndexMap = [...pivotData.measureInfoIndexMap, ...createMeasureInfoIndexMap(top, qHyperCube.qMeasureInfo)];

  // pivotData.measureInfoIndexMap.push(...measureInfoIndexMap);

  const newPivotData: PivotData = {
    headers: pivotData.headers,
    left: pivotData.left,
    top: newTop,
    data: newData,
    measureInfoIndexMap,
    leftDimensionInfoIndexMap: pivotData.leftDimensionInfoIndexMap,
    topDimensionInfoIndexMap: pivotData.topDimensionInfoIndexMap,
    size: {
      headers: {
        x: pivotData.size.headers.x,
        y: pivotData.size.headers.y,
      },
      top: {
        x: qArea.qLeft + qArea.qWidth,
        y: getTopRowCount(newTop)
      },
      left: {
        x: pivotData.size.left.x,
        y: pivotData.size.left.y
      },
      data: {
        x: qArea.qLeft + qArea.qWidth,
        y: qArea.qTop + qArea.qHeight
      },
      totalRows: getTopRowCount(newTop) + qArea.qTop + qArea.qHeight,
      totalColumns: getLeftColumnCount(pivotData.left) + qArea.qLeft + qArea.qWidth,
    }
  };

if (pivotData.measureInfoIndexMap.length !== pivotData.data[0].length) {
  console.warn('miss-matching length', pivotData.measureInfoIndexMap.length, pivotData.data[0].length, pivotData.top[pivotData.top.length - 1].length);
}
  console.log('newPivotData', newPivotData);

  return newPivotData;
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
    qNoOfLeftDims,
  } = qHyperCube;
  const left = extractLeft(qLeft);
  const top = extractTop(qTop);
  const leftDimensionInfoIndexMap = left.map((column, index) => {
    if (column[0].qType === NxDimCellType.NX_DIM_CELL_PSEUDO) return PSEUDO_DIMENSION_INDEX;
    return qEffectiveInterColumnSortOrder[index];
  });
  const topDimensionInfoIndexMap = top.map((row, index) => {
    const topIndex = index + qNoOfLeftDims;
    if (row[0].qType === NxDimCellType.NX_DIM_CELL_PSEUDO) return PSEUDO_DIMENSION_INDEX;
    return qEffectiveInterColumnSortOrder[topIndex];
  });
  const measureInfoIndexMap = (top[top.length - 1] || []).map(cell => {
    const { qText } = findParentPseudoDimension(cell) || {};
    const idx = qMeasureInfo.findIndex(measureInfo => measureInfo.qFallbackTitle ===  qText);
    if (idx === -1) {
      return 0; // Fallback solution when there is only a single measure, as in no pseudo dimenions.
    };

    return idx;
  });
  const headers = extractHeaders(qDimensionInfo, getTopRowCount(top), leftDimensionInfoIndexMap);
  appendLeafCount(top, top[top.length - 1]);

  const pivotData: PivotData = {
    left,
    top,
    data: [...(qData as unknown as EngineAPI.INxPivotValuePoint[][])],
    headers,
    measureInfoIndexMap,
    leftDimensionInfoIndexMap,
    topDimensionInfoIndexMap,
    size: {
      headers: {
        x: getColumnCount(headers),
        y: getRowCount(headers)
      },
      top: {
        x: qArea.qWidth,
        y: getTopRowCount(top)
      },
      left: {
        x: getLeftColumnCount(left),
        y: qArea.qHeight
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
