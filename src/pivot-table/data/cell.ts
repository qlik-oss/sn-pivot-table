import { Cell, CellValue, TYPE } from "../../types/types";

const createCell = ((value: CellValue, key = ''): Cell => {
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

export default createCell;
