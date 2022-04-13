import { PivotData, PivotDimensionCellWithPosition } from '../../types/types';
import extractHeaders from './extract-headers';
import extractLeft from './extract-left';
import extractTop from './extract-top';
import createDimInfoToIndexMapCallback from './helpers/dimension-info-to-index-map';

const getColumnCount = (matrix: unknown[][]): number => matrix.length;

const getRowCount = (matrix: unknown[][]): number => matrix[0]?.length || 0;

const getTopRowCount = (matrix: PivotDimensionCellWithPosition[][]): number => matrix.length;

const getLeftColumnCount = (matrix: PivotDimensionCellWithPosition[][]): number => matrix.length;

const createNewDataGrid = (qArea: EngineAPI.IRect, prevData: EngineAPI.INxPivotValuePoint[][], nextData: EngineAPI.INxPivotValuePoint[][]) => {
  const data = [...prevData];
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

export const appendTopData = (
  prevPivotData: PivotData,
  nextDataPage: EngineAPI.INxPivotPage,
): PivotData => {
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
      // Note that qSubNodes will be out-of-sync when last prev cell is replaced with first next cell
      firstNextCell.leafCount += lastPrevCell.leafCount; // Include leaf count from previous page
      prevAndNextRow.push(...prevRow.slice(0, -1)); // Slice to remove duplicate cell
    } else {
      prevAndNextRow.push(...prevRow);
    }
    prevAndNextRow.push(...nextRow);

    return prevAndNextRow;
  });

  const nextData = createNewDataGrid(qArea, prevPivotData.data, qData as unknown as EngineAPI.INxPivotValuePoint[][]);
  const width = Math.max(...nextData.map(row => row.length));
  const height = nextData.length;

  const nextPivotData: PivotData = {
    qDataPages: [...prevPivotData.qDataPages, nextDataPage],
    headers: prevPivotData.headers,
    left: prevPivotData.left,
    top: nextTop,
    data: nextData,
    leftDimensionInfoIndexMap: prevPivotData.leftDimensionInfoIndexMap,
    topDimensionInfoIndexMap: prevPivotData.topDimensionInfoIndexMap,
    size: {
      headers: prevPivotData.size.headers,
      top: {
        x: width,
        y: getTopRowCount(nextTop)
      },
      left: prevPivotData.size.left,
      data: {
        x: width,
        y: height,
      },
      totalRows: getTopRowCount(nextTop) + height,
      totalColumns: getLeftColumnCount(prevPivotData.left) + width,
    }
  };

  return nextPivotData;
};

export const appendLeftData = (prevPivotData: PivotData, nextDataPage: EngineAPI.INxPivotPage): PivotData => {
  const {
    qLeft,
    qData,
    qArea,
  } = nextDataPage;
  const extractedLeft = extractLeft(qLeft, qArea);
  const nextLeft = prevPivotData.left.map((prevCol, colIndex) => {
    const prevAndNextColumn = [];
    const nextColumn = extractedLeft[colIndex];
    const lastPrevCell = prevCol[prevCol.length - 1];
    const firstNextCell = nextColumn[0];

    // lastPrevCell.qDown > 0 means that the cell has more subnodes that can be paged
    if (lastPrevCell.qDown > 0 && lastPrevCell.qElemNo === firstNextCell.qElemNo) {
      // Note that qSubNodes will be out-of-sync when last prev cell is replaced with first next cell
      firstNextCell.leafCount += lastPrevCell.leafCount; // Include leaft count from previous page
      prevAndNextColumn.push(...prevCol.slice(0, -1)); // Slice to remove duplicate cell
    } else {
      prevAndNextColumn.push(...prevCol);
    }

    prevAndNextColumn.push(...nextColumn);

    return prevAndNextColumn;
  });

  const nextData = createNewDataGrid(qArea, prevPivotData.data, qData as unknown as EngineAPI.INxPivotValuePoint[][]);
  const width = Math.max(...nextData.map(row => row.length));
  const height = nextData.length;

  const nextPivotData: PivotData = {
    qDataPages: [...prevPivotData.qDataPages, nextDataPage],
    headers: prevPivotData.headers,
    left: nextLeft,
    top: prevPivotData.top,
    data: nextData,
    leftDimensionInfoIndexMap: prevPivotData.leftDimensionInfoIndexMap,
    topDimensionInfoIndexMap: prevPivotData.topDimensionInfoIndexMap,
    size: {
      headers: prevPivotData.size.headers,
      top: prevPivotData.size.top,
      left: {
        x: getLeftColumnCount(nextLeft),
        y: height
      },
      data: {
        x: width,
        y: height,
      },
      totalRows: getTopRowCount(prevPivotData.top) + height,
      totalColumns: getLeftColumnCount(nextLeft) + width,
    }
  };

  return nextPivotData;
};

export const appendData = (prevPivotData: PivotData, nextDataPage: EngineAPI.INxPivotPage): PivotData => {
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
  const left = extractLeft(qLeft, qArea);
  const top = extractTop(qTop, qArea);
  const leftDimensionInfoIndexMap = left.map(createDimInfoToIndexMapCallback(0, qEffectiveInterColumnSortOrder));
  const topDimensionInfoIndexMap = top.map(createDimInfoToIndexMapCallback(qNoOfLeftDims, qEffectiveInterColumnSortOrder));
  const headers = extractHeaders(qDimensionInfo, getTopRowCount(top), leftDimensionInfoIndexMap);
  const width = Math.max(...(qData as unknown as EngineAPI.INxPivotValuePoint[][]).map(row => row.length));
  const height = qData.length;

  const pivotData: PivotData = {
    qDataPages: [dataPage],
    left,
    top,
    data: [...(qData as unknown as EngineAPI.INxPivotValuePoint[][])],
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
