import { NxDimensionInfo } from "../../types/QIX";
import { CellValue } from "../../types/types";

const extractHeaders = (qDim: NxDimensionInfo[], rowCount: number, colCount: number): CellValue[][] => {
  const ary: CellValue[][] = [];

  for (let colIdx = 0; colIdx < colCount; colIdx += 1) {
    for (let rowIdx = 0; rowIdx < rowCount; rowIdx += 1) {
      if (!Array.isArray(ary[colIdx])) {
        ary[colIdx] = [];
      }

      ary[colIdx][rowIdx] = null;
    }
  }

  qDim.slice(0, colCount).forEach((info, colIdx) => {
    ary[colIdx][rowCount - 1] = info.qFallbackTitle;
  });

  return ary;
};

export default extractHeaders;
