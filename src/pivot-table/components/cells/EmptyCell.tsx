import React from "react";
import { borderStyle } from "../shared-styles";

interface EmptyCellProps {
  style: React.CSSProperties;
}

export const testId = "empty-cell";

export default function EmptyCell({ style }: EmptyCellProps): JSX.Element {
  return <div style={{ ...style, ...borderStyle }} data-testid={testId} />;
}
