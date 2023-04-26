import React from "react";
import { Cell } from "../../../types/types";
import { useStyleContext } from "../../contexts/StyleProvider";
import { borderStyle, getLineClampStyle, stickyCell, textStyle } from "../shared-styles";

interface LabelCellProps {
  cell: Cell;
  style: React.CSSProperties;
  isLeftColumn: boolean;
}

const topContainerStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "flex-start",
  alignItems: "flex-end",
};

const leftContainerStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "flex-start",
};

const getTextStyle = (clampCount: number): React.CSSProperties => ({
  ...textStyle,
  overflow: "hidden",
  textOverflow: "ellipsis",
  ...getLineClampStyle(clampCount),
});

export const testId = "pseudo-dimension-cell";

const PseudoDimensionCell = ({ cell, style, isLeftColumn }: LabelCellProps): JSX.Element => {
  const styleService = useStyleContext();
  const serviceStyle = isLeftColumn ? styleService.content : styleService.header;
  const containerStyle = isLeftColumn ? leftContainerStyle : topContainerStyle;

  return (
    <div title={cell.ref.qText} style={{ ...style, ...borderStyle, ...containerStyle }} data-testid={testId}>
      <div style={{ ...getTextStyle(styleService.lineClamp), ...serviceStyle, ...stickyCell }}>{cell.ref.qText}</div>
    </div>
  );
};

export default PseudoDimensionCell;
