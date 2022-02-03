import {
  NxPivotValuePoint,
  NxPivotDimensionCell,
  NxPivotPage,
  NxPageArea,
  NxDimensionInfo,
  NxDimCellType
} from '../types/QIX';
import { Cell, CellValue, Matrix, PivotData, StickyData, TYPE } from '../types/types'

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

const extractLeft = (qLeft: NxPivotDimensionCell[], qArea: NxPageArea): Matrix => {
  if (!qLeft.length) {
    return [];
  }

  const mapToInitRowValue = (value: undefined, i: number) => toCell(value, `null-${0}-${i}`);
  let rowIdx = 0;

  function extract(nodes: NxPivotDimensionCell[], matrix: Matrix = [], colIdx = 0): Matrix {
    if (!Array.isArray(matrix[colIdx])) {
      matrix[colIdx] = Array.from({ length: qArea.qHeight }, mapToInitRowValue);  // eslint-disable-line no-param-reassign
    }

    return nodes.reduce((innerMatrix: Matrix, node) => {
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

const extractTop = (qTop: Array<NxPivotDimensionCell>, qArea: NxPageArea): Matrix => {
  let colIdx = 0;
  if (!qTop.length) {
    return [];
  }

  function extract(nodes: Array<NxPivotDimensionCell>, matrix: Matrix = [], topRowIdx = 0): Matrix {
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

    return nodes.reduce((mtrx: Matrix, node: NxPivotDimensionCell, currIdx: number) => {
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

const addLeftTitles = (qDimensionInfo: Array<NxDimensionInfo>, matrix: Matrix) => {
  if (matrix.length) {
    const rowIdx = Math.max(matrix[0].findIndex((row) => row.value !== null) - 1, 0);

    qDimensionInfo.forEach((info, colIdx) => {
      const replace = matrix[colIdx]?.[rowIdx].value === null ? 1 : 0;
      matrix[colIdx]?.splice(rowIdx, replace, toCell(info.qFallbackTitle, `${colIdx}-${rowIdx}-${info.qFallbackTitle}`));
    });
  }
};

const addData = (data: Array<Array<NxPivotValuePoint>>, matrix: Matrix) => {
  data.forEach((row, rowIdx) => {
    row.forEach((datum, colIdx) => {
      matrix[colIdx].push(toCell(datum, `${datum.qType}-${colIdx}-${rowIdx}-${datum.qNum}`));
    });
  });
};

export default function toMatrix(dataPage: NxPivotPage, qDimensionInfo: Array<NxDimensionInfo>, qNoOfLeftDims = 0) : PivotData {
  const { qLeft, qArea, qTop, qData } = dataPage;

  const pivotData: PivotData = {
    matrix: [],
    topMatrix: extractTop(qTop, qArea),
    leftMatrix: extractLeft(qLeft, qArea),
    nbrLeftColumns: 0,
    nbrTopRows: 0,
  };

  pivotData.nbrTopRows = pivotData.topMatrix[0].length;
  pivotData.nbrLeftColumns = pivotData.leftMatrix.length;

  if (pivotData.nbrTopRows > 1) {
    pivotData.leftMatrix.forEach((col, colIdx) => {
      col.unshift(...Array(pivotData.nbrTopRows)
        .fill(null)
        .map((value, rowIdx) => toCell(value, `null-${colIdx}-${rowIdx}`))
      );
    });
  }

  addData(qData, pivotData.topMatrix);
  if (qNoOfLeftDims > 0) {
    addLeftTitles(qDimensionInfo, pivotData.leftMatrix);
  }

  pivotData.matrix = [...pivotData.leftMatrix, ...pivotData.topMatrix];

  return pivotData;
}


export function toData(dataPage: NxPivotPage, qDimensionInfo: Array<NxDimensionInfo>): StickyData {
  const { qLeft, qArea, qTop, qData } = dataPage;

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

  const extractHeaders = (qDim: Array<NxDimensionInfo>, nbrTopRows: number, nbrLeftColumns: number) => {
    const ary: Cell[][] = [];

    for (let colIdx = 0; colIdx < nbrLeftColumns; colIdx += 1) {
      for (let rowIdx = 0; rowIdx < nbrTopRows - 1; rowIdx += 1) {
        if (!Array.isArray(ary[colIdx])) {
          ary[colIdx] = [];
        }

        ary[colIdx][rowIdx] = toCell(null, `null-${colIdx}-${rowIdx}`);
      }
    }

    qDim.slice(0, nbrLeftColumns).forEach((info, colIdx) => {
      ary[colIdx].push(toCell(info.qFallbackTitle, `${colIdx}-${nbrTopRows - 1}-${info.qFallbackTitle}`))
    });

    return ary;
  };

  const data: StickyData = {
    left: extractLeft(qLeft, qArea),
    top: extractTop(qTop, qArea),
    data: extractData(qData),
    nbrTopRows: 0,
    nbrLeftColumns: 0,
    headers: [],
    size: {
      rows: 0,
      columns: 0
    }
  };

  data.nbrTopRows = data.top[0].length;
  data.nbrLeftColumns = data.left.length;
  data.headers = extractHeaders(qDimensionInfo, data.nbrTopRows, data.nbrLeftColumns);
  data.size.columns = data.nbrLeftColumns + dataPage.qArea.qWidth;
  data.size.rows = data.nbrTopRows + dataPage.qArea.qHeight;

  return data;
}
