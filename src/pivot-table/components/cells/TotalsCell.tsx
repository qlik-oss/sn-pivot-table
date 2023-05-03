import React from "react";
import type { Cell } from "../../../types/types";
import { useStyleContext } from "../../contexts/StyleProvider";
import { borderStyle, textStyle } from "../shared-styles";

interface LabelCellProps {
  style: React.CSSProperties;
  cell: Cell;
  isLeftColumn: boolean;
}

const labelTextStyle: React.CSSProperties = {
  ...textStyle,
  fontWeight: "bold",
};

export const testId = "totals-cell";

const TotalsCell = ({ cell, style, isLeftColumn }: LabelCellProps): JSX.Element => {
  const styleService = useStyleContext();
  const serviceStyle = isLeftColumn ? styleService.content : styleService.header;

  return (
    <div style={{ ...style, ...borderStyle }} data-testid={testId}>
      <div style={{ ...labelTextStyle, ...serviceStyle }}>{cell.ref.qText}</div>
    </div>
  );
};

export default TotalsCell;
