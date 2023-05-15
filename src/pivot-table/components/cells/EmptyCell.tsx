import React from "react";
import { useStyleContext } from "../../contexts/StyleProvider";
import { getBorderStyle } from "../shared-styles";

interface EmptyCellProps {
  style: React.CSSProperties;
  index?: number;
  isLastRow: boolean;
  isLastColumn: boolean;
}

export const testId = "empty-cell";

const EmptyCell = ({ style, index, isLastRow, isLastColumn }: EmptyCellProps): JSX.Element => {
  const {
    grid: { border },
  } = useStyleContext();
  return (
    <div
      style={{ ...style, ...getBorderStyle(isLastRow, isLastColumn, border) }}
      data-testid={testId}
      data-index={index}
    />
  );
};

export default EmptyCell;
