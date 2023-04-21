import React from "react";
import { areEqual } from "react-window";
import { TOTALS_CELL } from "../../../constants";
import NxDimCellType from "../../../types/QIX";
import { ListItemData } from "../../../types/types";
import DimensionCell from "./DimensionCell";
import EmptyCell from "./EmptyCell";
import PseudoDimensionCell from "./PseudoDimensionCell";
import TotalsCell from "./TotalsCell";

interface ListCallbackProps {
  index: number;
  style: React.CSSProperties;
  data: ListItemData;
}

const ListCellFactory = ({ index, style, data }: ListCallbackProps): JSX.Element | null => {
  const { list, isLeftColumn = false, isLast } = data;
  const cell = isLast ? list[index] : Object.values(list)[index];

  if (cell === undefined) {
    return <EmptyCell style={style} index={index} />;
  }

  if (cell.ref.qType === NxDimCellType.NX_DIM_CELL_PSEUDO) {
    return <PseudoDimensionCell cell={cell} style={style} isLeftColumn={isLeftColumn} />;
  }

  if (cell.ref.qType === NxDimCellType.NX_DIM_CELL_TOTAL && cell.ref.qElemNo === TOTALS_CELL) {
    return <TotalsCell cell={cell} style={style} isLeftColumn={isLeftColumn} />;
  }

  if (cell.ref.qType === NxDimCellType.NX_DIM_CELL_EMPTY) {
    return <EmptyCell style={style} index={index} />;
  }

  return (
    <DimensionCell
      cell={cell}
      data={data}
      rowIndex={cell.y}
      colIndex={cell.x}
      style={style}
      isLeftColumn={isLeftColumn}
    />
  );
};

export default React.memo(ListCellFactory, areEqual);
