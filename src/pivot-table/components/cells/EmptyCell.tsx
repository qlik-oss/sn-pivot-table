import React from "react";
import { useStyleContext } from "../../contexts/StyleProvider";
import { getBorderStyle, getTotalCellDividerStyle } from "../shared-styles";

export interface EmptyCellProps {
  style: React.CSSProperties;
  index: number;
  isLastRow: boolean;
  isLastColumn: boolean;
  showLastRowBorderBottom: boolean;
  isLeftColumn: boolean;
  showTotalCellDivider: boolean;
}

export const testId = "empty-cell";

const EmptyCell = ({
  style,
  index,
  isLastRow,
  isLastColumn,
  showLastRowBorderBottom,
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
