import { CellValue, PivotData } from '../../types/types';
import extractHeaders from './extract-headers';
import extractLeft from './extract-left';
import extractTop from './extract-top';

const getColumnCount = (matrix: CellValue[][]): number => matrix.length;

const getRowCount = (matrix: CellValue[][]): number => matrix[0]?.length || 0;

const getTopColumnCount = (matrix: CellValue[][]): number => matrix[matrix.length - 1].length || 0;

const getTopRowCount = (matrix: CellValue[][]): number => matrix.length;

export default function createData(
  dataPage: EngineAPI.INxPivotPage,
  qDimensionInfo: EngineAPI.INxDimensionInfo[],
  ): PivotData {
  const {
    qLeft,
    qArea,
    qTop,
    qData } = dataPage;
  const left = extractLeft(qLeft, qArea.qHeight);
  const top = extractTop(qTop);
  const headers = extractHeaders(qDimensionInfo, getTopRowCount(top), getColumnCount(left));
  // const topTree = extractTopTree(qTop);
  const pivotData: PivotData = {
    left,
    top,
    data: qData as unknown as EngineAPI.INxPivotValuePoint[][],
    headers,
    // topTree,
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

  return pivotData;
}
