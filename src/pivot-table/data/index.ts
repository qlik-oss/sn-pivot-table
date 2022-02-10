import { NxDimensionInfo, NxPivotPage } from '../../types/QIX';
import { CellValue, PivotData } from '../../types/types';
import extractHeaders from './extract-headers';
import extractLeft from './extract-left';
import extractTop from './extract-top';

const getColumnCount = (matrix: CellValue[][]): number => matrix.length;

const getRowCount = (matrix: CellValue[][]): number => matrix[0]?.length || 0;

export default function createData(dataPage: NxPivotPage, qDimensionInfo: NxDimensionInfo[], leftDimCount: number): PivotData {
  const { qLeft, qArea, qTop, qData } = dataPage;
  const leftColumnCount = qDimensionInfo.slice(0, leftDimCount).filter(dim => dim.qCardinalities.qHypercubeCardinal > 0).length;
  const topRowCount = qDimensionInfo.slice(leftDimCount).filter(dim => dim.qCardinalities.qHypercubeCardinal > 0).length;
  const left = extractLeft(qLeft, qArea.qHeight, leftColumnCount);
  const top = extractTop(qTop, qArea.qWidth, topRowCount);
  const headers = extractHeaders(qDimensionInfo, getRowCount(top), getColumnCount(left));
  const pivotData: PivotData = {
    left,
    top,
    data: qData,
    headers,
    size: {
      headers: {
        x: getColumnCount(headers),
        y: getRowCount(headers)
      },
      top: {
        x: getColumnCount(top),
        y: getRowCount(top)
      },
      left: {
        x: getColumnCount(left),
        y: getRowCount(left)
      },
      data: {
        x: qArea.qWidth,
        y: qArea.qHeight
      },
      totalRows: getRowCount(top) + qArea.qHeight,
      totalColumns: getColumnCount(left) + qArea.qWidth,
    }
  };

  return pivotData;
}
