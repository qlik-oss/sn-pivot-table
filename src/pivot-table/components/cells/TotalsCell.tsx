import React from "react";
import type { Cell } from "../../../types/types";
import { useStyleContext } from "../../contexts/StyleProvider";
import { getBorderStyle, textStyle } from "../shared-styles";

interface LabelCellProps {
  style: React.CSSProperties;
  cell: Cell;
  isLeftColumn: boolean;
  isLastRow: boolean;
  isLastColumn: boolean;
}

const labelTextStyle: React.CSSProperties = {
  ...textStyle,
  fontWeight: "600",
};

export const testId = "totals-cell";

const TotalsCell = ({ cell, style, isLeftColumn, isLastRow, isLastColumn }: LabelCellProps): JSX.Element => {
  const styleService = useStyleContext();
  const serviceStyle = isLeftColumn ? styleService.content : styleService.header;

  return (
    <div style={{ ...style, ...getBorderStyle(isLastRow, isLastColumn) }} data-testid={testId}>
      <div style={{ ...labelTextStyle, ...serviceStyle }}>{cell.ref.qText}</div>
    </div>
  );
};

export default TotalsCell;
