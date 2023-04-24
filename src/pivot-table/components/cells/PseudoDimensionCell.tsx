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
  justifyContent: "start",
  alignItems: "end",
};

const leftContainerStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "start",
};

const stickyCell: React.CSSProperties = {
  width: "fit-content",
  maxWidth: "100%",
  position: "sticky",
  left: 4,
  top: 4,
};

export const testId = "pseudo-dimension-cell";

const PseudoDimensionCell = ({ cell, style, isLeftColumn }: LabelCellProps): JSX.Element => {
  const styleService = useStyleContext();
  const serviceStyle = isLeftColumn ? styleService.content : styleService.header;
  const containerStyle = isLeftColumn ? leftContainerStyle : topContainerStyle;

  return (
    <div title={cell.ref.qText} style={{ ...style, ...borderStyle, ...containerStyle }} data-testid={testId}>
      <div style={{ ...textStyle, ...serviceStyle, ...stickyCell }}>{cell.ref.qText}</div>
    </div>
  );
};

export default PseudoDimensionCell;
