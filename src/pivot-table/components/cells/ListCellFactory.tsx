import React from "react";
import { areEqual } from "react-window";
import type { ListItemData } from "../../../types/types";
import { useStyleContext } from "../../contexts/StyleProvider";
import { shouldShowTotalCellDivider } from "../../hooks/use-is-total-cell";
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
  const { list, isLeftColumn = false, isLast, itemCount, showLastBorder, listValues, totalDividerIndex } = data;
  const isLastRow = isLeftColumn ? index === itemCount - 1 : isLast;
  const isLastColumn = isLeftColumn ? isLast : index === itemCount - 1;

  /**
   * When "isLast" is true, the keys in the "list" object, which are numerical values (ex. "{ 0: cell, 1: cell }"),
   * matches the number of rows the react-window List component. So "index" will exist, as some point, as a key in "list".
   *
   * But when "isLast" is false, the keys in "list" object, are not guaranteed to match "index".
   * To get around that, the "list" object is converted to an array.
   */
  const cell = isLast ? list[index] : listValues[index];
  const showTotalCellDivider = shouldShowTotalCellDivider(cell, totalDividerIndex);

  if (cell === undefined || cell.isEmpty) {
    const { background } = styleService.dimensionValue;

    return (
      <EmptyCell
        style={{ ...style, background }}
        index={index}
        isLastRow={isLastRow}
        isLastColumn={isLastColumn}
        showLastBorder={showLastBorder}
        isLeftColumn={isLeftColumn}
        showTotalCellDivider={showTotalCellDivider}
      />
    );
  }

  if (cell.isPseudoDimension) {
    return (
      <PseudoDimensionCell
        cell={cell}
        style={style}
        isLeftColumn={isLeftColumn}
        isLastRow={isLastRow}
        isLastColumn={isLastColumn}
        showLastBorder={showLastBorder}
        showTotalCellDivider={showTotalCellDivider}
      />
    );
  }

  if (cell.isTotal) {
    return (
      <TotalsCell
        cell={cell}
        style={style}
        isLeftColumn={isLeftColumn}
        isLastRow={isLastRow}
        isLastColumn={isLastColumn}
        showTotalCellDivider={showTotalCellDivider}
        showLastBorder={showLastBorder}
      />
    );
  }

  return (
    <DimensionCell
      cell={cell}
      data={data}
      rowIndex={cell.pageY}
      colIndex={cell.x}
      style={style}
      isLeftColumn={isLeftColumn}
      isLastRow={isLastRow}
      isLastColumn={isLastColumn}
      showTotalCellDivider={showTotalCellDivider}
    />
  );
};

export default React.memo(ListCellFactory, areEqual);
