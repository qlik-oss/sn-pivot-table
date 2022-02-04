import { NxPivotValuePoint } from "../../types/QIX";
import { Cell } from "../../types/types";
import createCell from "./cell";

const extractData = (data: Array<Array<NxPivotValuePoint>>): Cell[][] => {
  const ary: Cell[][] = [];
  data.forEach((row, rowIdx) => {
    row.forEach((datum, colIdx) => {
      if (!Array.isArray(ary[colIdx])) {
        ary[colIdx] = [];
      }
      ary[colIdx].push(createCell(datum, `${datum.qType}-${colIdx}-${rowIdx}-${datum.qNum}`));
    });
  });

  return ary;
};

export default extractData;
