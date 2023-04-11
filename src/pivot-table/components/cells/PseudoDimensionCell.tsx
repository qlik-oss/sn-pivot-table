import React from "react";
import { Cell } from "../../../types/types";
import { useStyleContext } from "../../contexts/StyleProvider";
import { borderStyle, textStyle } from "../shared-styles";

interface LabelCellProps {
  cell: Cell;
  style: React.CSSProperties;
  isLeftColumn: boolean;
}

const topContainerStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

const leftContainerStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
};

export const testId = "pseudo-dimension-cell";

export default function PseudoDimensionCell({ cell, style, isLeftColumn }: LabelCellProps): JSX.Element {
  const styleService = useStyleContext();
  const serviceStyle = isLeftColumn ? styleService.content : styleService.header;
  const containerStyle = isLeftColumn ? leftContainerStyle : topContainerStyle;

  return (
    <div title={cell.ref.qText} style={{ ...style, ...borderStyle, ...containerStyle }} data-testid={testId}>
      <div style={{ ...textStyle, ...serviceStyle }}>{cell.ref.qText}</div>
    </div>
  );
}
