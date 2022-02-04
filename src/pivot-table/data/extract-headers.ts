import { NxDimensionInfo } from "../../types/QIX";
import { Cell } from "../../types/types";
import createCell from "./cell";

const extractHeaders = (qDim: NxDimensionInfo[], rowCount: number, colCount: number): Cell[][] => {
  const ary: Cell[][] = [];

  for (let colIdx = 0; colIdx < colCount; colIdx += 1) {
    for (let rowIdx = 0; rowIdx < rowCount; rowIdx += 1) {
      if (!Array.isArray(ary[colIdx])) {
        ary[colIdx] = [];
      }

      ary[colIdx][rowIdx] = createCell(null, `null-${colIdx}-${rowIdx}`);
    }
  }

  qDim.slice(0, colCount).forEach((info, colIdx) => {
    ary[colIdx][rowCount - 1] = createCell(info.qFallbackTitle, `${colIdx}-${rowCount - 1}-${info.qFallbackTitle}`);
  });

  return ary;
};

export default extractHeaders;
