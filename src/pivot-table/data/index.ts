import { NxDimensionInfo, NxPivotPage } from "../../types/QIX";
import { Cell, PivotData } from "../../types/types";
import extractHeaders from "./extract-headers";
import extractLeft from "./extract-left";
import extractTop from "./extract-top";

const getColumnCount = (matrix: Cell[][]): number => matrix.length;

const getRowCount = (matrix: Cell[][]): number => matrix[0]?.length || 0;

export default function createData(dataPage: NxPivotPage, qDimensionInfo: NxDimensionInfo[]): PivotData {
  const { qLeft, qArea, qTop, qData } = dataPage;

  const left = extractLeft(qLeft, qArea);
  const top = extractTop(qTop, qArea);
  const data = qData;
  const headers = extractHeaders(qDimensionInfo, getRowCount(top), getColumnCount(left));
  const pivotData: PivotData = {
    left,
    top,
    data,
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
