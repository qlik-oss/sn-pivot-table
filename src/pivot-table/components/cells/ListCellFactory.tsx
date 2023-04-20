import React from "react";
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
  const { list, isLeftColumn = false } = data;
  const cell = list[index];

  if (cell === undefined) {
    if (style.height === 0) {
      return null;
    }

    return <EmptyCell style={style} />;
  }

  if (cell.ref.qType === NxDimCellType.NX_DIM_CELL_PSEUDO) {
    return <PseudoDimensionCell cell={cell} style={style} isLeftColumn={isLeftColumn} />;
  }

  if (cell.ref.qType === NxDimCellType.NX_DIM_CELL_TOTAL && cell.ref.qElemNo === TOTALS_CELL) {
    return <TotalsCell cell={cell} style={style} isLeftColumn={isLeftColumn} />;
  }

  if (cell.ref.qType === NxDimCellType.NX_DIM_CELL_EMPTY) {
    return <EmptyCell style={style} />;
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

export default ListCellFactory;
