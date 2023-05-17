import React from "react";
import { areEqual } from "react-window";
import { TOTALS_CELL } from "../../../constants";
import NxDimCellType from "../../../types/QIX";
import type { ListItemData } from "../../../types/types";
import { useStyleContext } from "../../contexts/StyleProvider";
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
  const styleService = useStyleContext();
  const { list, isLeftColumn = false, isLast, itemCount } = data;
  const isLastRow = isLeftColumn ? index === itemCount - 1 : isLast;
  const isLastColumn = isLeftColumn ? isLast : index === itemCount - 1;

  /**
   * When "isLast" is true, the keys in the "list" object, which are numerical values (ex. "{ 0: cell, 1: cell }"),
   * matches the number of rows the react-window List component. So "index" will exist, as some point, as a key in "list".
   *
   * But when "isLast" is false, the keys in "list" object, are not guaranteed to match "index".
   * To get around that, the "list" object is converted to an array.
   */
  const cell = isLast ? list[index] : Object.values(list)[index];

  if (cell === undefined || cell.ref.qType === NxDimCellType.NX_DIM_CELL_EMPTY) {
    const background = isLeftColumn ? styleService.rowContent.background : styleService.columnContent.background;
    return (
      <EmptyCell style={{ ...style, background }} index={index} isLastRow={isLastRow} isLastColumn={isLastColumn} />
    );
  }

  if (cell.ref.qType === NxDimCellType.NX_DIM_CELL_PSEUDO) {
    return (
      <PseudoDimensionCell
        cell={cell}
        style={style}
        isLeftColumn={isLeftColumn}
        isLastRow={isLastRow}
        isLastColumn={isLastColumn}
      />
    );
  }

  if (cell.ref.qType === NxDimCellType.NX_DIM_CELL_TOTAL && cell.ref.qElemNo === TOTALS_CELL) {
    return (
      <TotalsCell
        cell={cell}
        style={style}
        isLeftColumn={isLeftColumn}
        isLastRow={isLastRow}
        isLastColumn={isLastColumn}
      />
    );
  }

  return (
    <DimensionCell
      cell={cell}
      data={data}
      rowIndex={cell.y}
      colIndex={cell.x}
      style={style}
      isLeftColumn={isLeftColumn}
      isLastRow={isLastRow}
      isLastColumn={isLastColumn}
    />
  );
};

export default React.memo(ListCellFactory, areEqual);
