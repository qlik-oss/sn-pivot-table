import { PivotData, PivotDimensionCellWithPosition } from '../../types/types';
import extractHeaders from './extract-headers';
import extractLeftGrid from './extract-left';
import extractTopGrid from './extract-top';
import createDimInfoToIndexMapCallback from './helpers/dimension-info-to-index-map';

const getColumnCount = (matrix: unknown[][]): number => matrix.length;

const getRowCount = (matrix: unknown[][]): number => matrix[0]?.length || 0;

const getTopRowCount = (matrix: PivotDimensionCellWithPosition[][]): number => matrix.length;

const getLeftColumnCount = (matrix: PivotDimensionCellWithPosition[][]): number => matrix.length;

const createNewDataGrid = (qArea: EngineAPI.IRect, prevData: EngineAPI.INxPivotValuePoint[][], nextData: EngineAPI.INxPivotValuePoint[][]) => {
  const data = prevData.map(row => [...row]);
  nextData.forEach((row, rowIndex) => {
    row.forEach((cell, colIndex) => {
      if (!Array.isArray(data[qArea.qTop + rowIndex])) {
        data[qArea.qTop + rowIndex] = [];
      }
      data[qArea.qTop + rowIndex][qArea.qLeft + colIndex] = cell;
    });
  });

  return data;
};

export const addToGrid = (prevPivotData: PivotData, nextDataPage: EngineAPI.INxPivotPage): PivotData => {
  const {
    qLeft,
    qTop,
    qData,
    qArea,
  } = nextDataPage;
  const leftGrid = extractLeftGrid(prevPivotData.leftGrid, qLeft, qArea);
  const nextLeft = leftGrid.map(col => col.filter(cell => typeof cell !== 'undefined'));
  const topGrid = extractTopGrid(prevPivotData.topGrid, qTop, qArea);
  const nextTop = topGrid.map(row => row.filter(cell => typeof cell !== 'undefined'));
  const nextData = createNewDataGrid(qArea, prevPivotData.data, qData as unknown as EngineAPI.INxPivotValuePoint[][]);
  const width = Math.max(...nextData.map(row => row.length));
  const height = nextData.length;

  const nextPivotData: PivotData = {
    ...prevPivotData,
    qDataPages: [...prevPivotData.qDataPages, nextDataPage],
    left: nextLeft,
    leftGrid,
    top: nextTop,
    topGrid,
    data: nextData,
    size: {
      headers: prevPivotData.size.headers,
      top: {
        x: width,
        y: getTopRowCount(nextTop)
      },
      left: {
        x: getLeftColumnCount(nextLeft),
        y: height
      },
      data: {
        x: width,
        y: height,
      },
      totalRows: getTopRowCount(nextTop) + height,
      totalColumns: getLeftColumnCount(nextLeft) + width,
    }
  };

  return nextPivotData;
};

export const addDataToGrid = (prevPivotData: PivotData, nextDataPage: EngineAPI.INxPivotPage): PivotData => {
  const {
    qData,
    qArea,
  } = nextDataPage;
  const data = createNewDataGrid(qArea, prevPivotData.data, qData as unknown as EngineAPI.INxPivotValuePoint[][]);

  return {
    ...prevPivotData,
    qDataPages: [...prevPivotData.qDataPages, nextDataPage],
    data
  };
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
    qEffectiveInterColumnSortOrder,
    qNoOfLeftDims,
  } = qHyperCube;
  const leftGrid = extractLeftGrid([[]], qLeft, qArea);
  const left = leftGrid.map(col => col.filter(cell => typeof cell !== 'undefined'));
  const topGrid = extractTopGrid([[]], qTop, qArea);
  const top = topGrid.map(row => row.filter(cell => typeof cell !== 'undefined'));
  const leftDimensionInfoIndexMap = left.map(createDimInfoToIndexMapCallback(0, qEffectiveInterColumnSortOrder));
  const topDimensionInfoIndexMap = top.map(createDimInfoToIndexMapCallback(qNoOfLeftDims, qEffectiveInterColumnSortOrder));
  const headers = extractHeaders(qDimensionInfo, getTopRowCount(top), leftDimensionInfoIndexMap);
  const width = Math.max(...(qData as unknown as EngineAPI.INxPivotValuePoint[][]).map(row => row.length));
  const height = qData.length;

  const pivotData: PivotData = {
    qDataPages: [dataPage], // TODO remove as it just used for debugging
    left,
    leftGrid,
    top,
    topGrid,
    data: (qData as unknown as EngineAPI.INxPivotValuePoint[][]).map(row => [...row]),
    headers,
    leftDimensionInfoIndexMap,
    topDimensionInfoIndexMap,
    size: {
      headers: {
        x: getColumnCount(headers),
        y: getRowCount(headers)
      },
      top: {
        x: width,
        y: getTopRowCount(top)
      },
      left: {
        x: getLeftColumnCount(left),
        y: height
      },
      data: {
        x: width,
        y: height
      },
      totalRows: getTopRowCount(top) + height,
      totalColumns: getLeftColumnCount(left) + width,
    }
  };

  return pivotData;
}
