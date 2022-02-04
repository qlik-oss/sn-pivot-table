import {
  NxPivotValuePoint,
  NxPivotDimensionCell,
  NxPivotPage,
  NxPageArea,
  NxDimensionInfo,
  NxDimCellType
} from '../types/QIX';
import { Cell, CellValue, PivotData, TYPE } from '../types/types'

const toCell = ((value: CellValue, key = ''): Cell => {
  const cell:Cell = {
    key,
    value,
    type: TYPE.EMPTY
  };

  if (typeof value === 'object' && value !== null) {
    if ("qElemNo" in value) {
      cell.key = key || value.qElemNo;
      cell.type = TYPE.DIMENSION;
    } else {
      cell.key = key || value.qNum;
      cell.type = TYPE.MEASURE;
    }
  } else if (typeof value === 'string') {
    cell.key = key || value;
    cell.type = TYPE.LABEL;
  }

  return cell;
});

const extractLeft = (qLeft: NxPivotDimensionCell[], qArea: NxPageArea): Cell[][] => {
  if (!qLeft.length) {
    return [];
  }

  const mapToInitRowValue = (value: undefined, i: number) => toCell(value, `null-${0}-${i}`);
  let rowIdx = 0;

  function extract(nodes: NxPivotDimensionCell[], matrix: Cell[][] = [], colIdx = 0): Cell[][] {
    if (!Array.isArray(matrix[colIdx])) {
      matrix[colIdx] = Array.from({ length: qArea.qHeight }, mapToInitRowValue);  // eslint-disable-line no-param-reassign
    }

    return nodes.reduce((innerMatrix: Cell[][], node) => {
      if (node.qType !== NxDimCellType.NX_DIM_CELL_TOTAL) {
        innerMatrix[colIdx][rowIdx] = toCell(node, `${node.qType}-${colIdx}-${rowIdx}-${node.qElemNo}`); // eslint-disable-line no-param-reassign
        rowIdx += node.qCanCollapse ? 0 : 1;
      }

      if (node.qCanCollapse) {
        return extract(node.qSubNodes, innerMatrix, colIdx + 1);
      }

      return innerMatrix;
    }, matrix);
  }

  return extract(qLeft);
};

const extractTop = (qTop: Array<NxPivotDimensionCell>, qArea: NxPageArea): Cell[][] => {
  let colIdx = 0;
  if (!qTop.length) {
    return [];
  }

  function extract(nodes: Array<NxPivotDimensionCell>, matrix: Cell[][] = [], topRowIdx = 0): Cell[][] {
    if (!matrix.length) {
      matrix.push(...Array(qArea.qWidth)
        .fill(null)
        .map((value, i) => [toCell(value, `null-${i}-${0}`)])
      );
    }

    if (Array.isArray(matrix[colIdx+1]) && matrix[colIdx+1].length - 1 < topRowIdx) {
      matrix.forEach((col, i) => {
        col.push(toCell(null, `null-${i}-${topRowIdx}`))
      });
    }

    return nodes.reduce((mtrx: Cell[][], node: NxPivotDimensionCell, currIdx: number) => {
      colIdx += currIdx === 0 ? 0 : 1;
      mtrx[colIdx][topRowIdx] = toCell(node, `${node.qType}-${colIdx}-${topRowIdx}-${node.qElemNo}`); // eslint-disable-line no-param-reassign

      if (node.qSubNodes.length) {
        return extract(node.qSubNodes, mtrx, topRowIdx + 1);
      }

      return mtrx;
    }, matrix);
  };

  return extract(qTop);
};

const extractData = (data: Array<Array<NxPivotValuePoint>>) => {
  const ary: Cell[][] = [];
  data.forEach((row, rowIdx) => {
    row.forEach((datum, colIdx) => {
      if (!Array.isArray(ary[colIdx])) {
        ary[colIdx] = [];
      }
      ary[colIdx].push(toCell(datum, `${datum.qType}-${colIdx}-${rowIdx}-${datum.qNum}`));
    });
  });

  return ary;
};

const extractHeaders = (qDim: Array<NxDimensionInfo>, rowCount: number, colCount: number) => {
  const ary: Cell[][] = [];

  for (let colIdx = 0; colIdx < colCount; colIdx += 1) {
    for (let rowIdx = 0; rowIdx < rowCount; rowIdx += 1) {
      if (!Array.isArray(ary[colIdx])) {
        ary[colIdx] = [];
      }

      ary[colIdx][rowIdx] = toCell(null, `null-${colIdx}-${rowIdx}`);
    }
  }

  qDim.slice(0, colCount).forEach((info, colIdx) => {
    ary[colIdx][rowCount - 1] = toCell(info.qFallbackTitle, `${colIdx}-${rowCount - 1}-${info.qFallbackTitle}`);
  });

  return ary;
};

const getColumnCount = (matrix: Cell[][]): number => matrix.length;

const getRowCount = (matrix: Cell[][]): number => matrix[0].length;

export default function toData(dataPage: NxPivotPage, qDimensionInfo: Array<NxDimensionInfo>): PivotData {
  const { qLeft, qArea, qTop, qData } = dataPage;

  const left = extractLeft(qLeft, qArea);
  const top = extractTop(qTop, qArea);
  const data = extractData(qData);
  const headers = extractHeaders(qDimensionInfo, top[0].length, left.length);
  const pivotData: PivotData = {
    left,
    top,
    data,
    headers,
    size: {
      headers: { x: getColumnCount(headers), y: getRowCount(headers) },
      top: { x: getColumnCount(top), y: getRowCount(top) },
      left: { x: getColumnCount(left), y: getRowCount(left) },
      data: { x: getColumnCount(data), y: getRowCount(data) },
      totalRows: getRowCount(top) + getRowCount(data),
      totalColumns: getColumnCount(left) + getColumnCount(data),
    }
  };

  return pivotData;
}
