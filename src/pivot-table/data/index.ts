import { PivotData, PivotDimensionCellWithPosition } from '../../types/types';
import extractHeaders from './extract-headers';
import extractLeft from './extract-left';
import extractTop from './extract-top';
import createMeasureInfoIndexMap from './helpers/create-measure-info-index-map';
import dimensionInfoToIndexMap from './helpers/dimension-info-to-index-map';

const getColumnCount = (matrix: unknown[][]): number => matrix.length;

const getRowCount = (matrix: unknown[][]): number => matrix[0]?.length || 0;

const getTopRowCount = (matrix: PivotDimensionCellWithPosition[][]): number => matrix.length;

const getLeftColumnCount = (matrix: PivotDimensionCellWithPosition[][]): number => matrix.length;

export const appendTopData = (prevPivotData: PivotData, nextDataPage: EngineAPI.INxPivotPage, qHyperCube: EngineAPI.IHyperCube): PivotData => {
  const {
    qTop,
    qData,
    qArea,
  } = nextDataPage;
  const extractedTop = extractTop(qTop, qArea);
  const nextTop = prevPivotData.top.map((prevRow, rowIndex) => {
    const prevAndNextRow = [];
    const nextRow = extractedTop[rowIndex];
    const lastPrevCell = prevRow[prevRow.length - 1];
    const firstNextCell = nextRow[0];

    // lastPrevCell.qDown > 0 means that the cell has more subnodes that can be paged
    if (lastPrevCell.qDown > 0 && lastPrevCell.qElemNo === firstNextCell.qElemNo) {
      // Note that qSubNodes will be out-of-sync last prev cell is replaced with first next cell
      firstNextCell.leafCount += lastPrevCell.leafCount; // Include leaft count from previous page
      prevAndNextRow.push(...prevRow.slice(0, -1));
    } else {
      prevAndNextRow.push(...prevRow);
    }
    prevAndNextRow.push(...nextRow);

    return prevAndNextRow;
  });

  const nextqData = (qData as unknown as EngineAPI.INxPivotValuePoint[][]);
  const nextData = prevPivotData.data.map((row, rowIndex) => [...row, ...nextqData[rowIndex]]);

  const measureInfoIndexMap = [...prevPivotData.measureInfoIndexMap, ...createMeasureInfoIndexMap(extractedTop, qHyperCube.qMeasureInfo)];

  const nextPivotData: PivotData = {
    qDataPages: [...prevPivotData.qDataPages, nextDataPage],
    headers: prevPivotData.headers,
    left: prevPivotData.left,
    top: nextTop,
    data: nextData,
    measureInfoIndexMap,
    leftDimensionInfoIndexMap: prevPivotData.leftDimensionInfoIndexMap,
    topDimensionInfoIndexMap: prevPivotData.topDimensionInfoIndexMap,
    size: {
      headers: {
        x: prevPivotData.size.headers.x,
        y: prevPivotData.size.headers.y,
      },
      top: {
        x: qArea.qLeft + qArea.qWidth,
        y: getTopRowCount(nextTop)
      },
      left: {
        x: prevPivotData.size.left.x,
        y: prevPivotData.size.left.y
      },
      data: {
        x: qArea.qLeft + qArea.qWidth,
        y: qArea.qTop + qArea.qHeight
      },
      totalRows: getTopRowCount(nextTop) + qArea.qTop + qArea.qHeight,
      totalColumns: getLeftColumnCount(prevPivotData.left) + qArea.qLeft + qArea.qWidth,
    }
  };

if (prevPivotData.measureInfoIndexMap.length !== prevPivotData.data[0].length) {
  console.warn('miss-matching length', prevPivotData.measureInfoIndexMap.length, prevPivotData.data[0].length, prevPivotData.top[prevPivotData.top.length - 1].length);
}
  console.debug('nextPivotData', nextPivotData);

  return nextPivotData;
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
  const top = extractTop(qTop, qArea);
  const leftDimensionInfoIndexMap = left.map(dimensionInfoToIndexMap(0, qEffectiveInterColumnSortOrder));
  const topDimensionInfoIndexMap = top.map(dimensionInfoToIndexMap(qNoOfLeftDims, qEffectiveInterColumnSortOrder));
  const measureInfoIndexMap = createMeasureInfoIndexMap(top, qMeasureInfo);
  const headers = extractHeaders(qDimensionInfo, getTopRowCount(top), leftDimensionInfoIndexMap);

  const pivotData: PivotData = {
    qDataPages: [dataPage],
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
