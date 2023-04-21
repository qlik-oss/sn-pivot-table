import React from "react";
import { borderStyle } from "../shared-styles";

interface EmptyCellProps {
  style: React.CSSProperties;
  index?: number;
}

export const testId = "empty-cell";

const EmptyCell = ({ style, index }: EmptyCellProps): JSX.Element => (
  <div style={{ ...style, ...borderStyle }} data-testid={testId} data-index={index} />
);

export default EmptyCell;
