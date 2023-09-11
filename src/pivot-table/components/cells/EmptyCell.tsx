import React from "react";
import type { ShowLastBorder } from "../../../types/types";
import { useStyleContext } from "../../contexts/StyleProvider";
import { getBorderStyle, getTotalCellDividerStyle } from "../shared-styles";

export interface EmptyCellProps {
  style: React.CSSProperties;
  index: number;
  isLastRow: boolean;
  isLastColumn: boolean;
  showLastBorder: ShowLastBorder;
  isLeftColumn: boolean;
  showTotalCellDivider: boolean;
}

export const testId = "empty-cell";

const EmptyCell = ({
  style,
  index,
  isLastRow,
  isLastColumn,
  showLastBorder,
  isLeftColumn,
  showTotalCellDivider,
}: EmptyCellProps): JSX.Element => {
  const {
    grid: { border, divider },
  } = useStyleContext();

  return (
    <div
      style={{
        ...style,
        ...getBorderStyle(isLastRow, isLastColumn, border, showLastBorder),
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
