import React from "react";
import type { Cell } from "../../../types/types";
import { useStyleContext } from "../../contexts/StyleProvider";
import { shouldShowTotalCellDivider } from "../../hooks/use-is-total-cell";
import { getBorderStyle, getTotalCellDividerStyle } from "../shared-styles";

export interface EmptyCellProps {
  // eslint-disable-next-line react/require-default-props
  cell?: Cell;
  style: React.CSSProperties;
  index: number;
  isLastRow: boolean;
  isLastColumn: boolean;
  showLastRowBorderBottom: boolean;
  isLeftColumn: boolean;
}

export const testId = "empty-cell";

const EmptyCell = ({
  style,
  index,
  isLastRow,
  isLastColumn,
  showLastRowBorderBottom,
  cell,
  isLeftColumn,
}: EmptyCellProps): JSX.Element => {
  const {
    grid: { border, divider },
  } = useStyleContext();

  const showTotalCellDivider = shouldShowTotalCellDivider(cell);

  return (
    <div
      style={{
        ...style,
        ...getBorderStyle(isLastRow, isLastColumn, border, showLastRowBorderBottom),
        ...getTotalCellDividerStyle({
          bottomDivider: showTotalCellDivider && isLeftColumn,
          rightDivider: showTotalCellDivider && !isLeftColumn,
          borderColor: divider,
        }),
      }}
      data-testid={testId}
      data-index={index}
    />
  );
};

export default EmptyCell;
