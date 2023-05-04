import React from "react";
import { getBorderStyle } from "../shared-styles";

interface EmptyCellProps {
  style: React.CSSProperties;
  index?: number;
  isLastRow: boolean;
  isLastColumn: boolean;
}

export const testId = "empty-cell";

const EmptyCell = ({ style, index, isLastRow, isLastColumn }: EmptyCellProps): JSX.Element => (
  <div style={{ ...style, ...getBorderStyle(isLastRow, isLastColumn) }} data-testid={testId} data-index={index} />
);

export default EmptyCell;
