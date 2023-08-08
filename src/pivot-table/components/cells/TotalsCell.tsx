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
  const serviceStyle = isLeftColumn ? styleService.rowContent.totalLabel : styleService.columnContent.totalLabel;
  const { fontSize, fontFamily } = isLeftColumn ? styleService.rowContent : styleService.columnContent;

  return (
    <div
      style={{ ...style, ...getBorderStyle(isLastRow, isLastColumn, styleService.grid.border, false), ...serviceStyle }}
      data-testid={testId}
    >
      <div style={{ ...labelTextStyle, fontSize, fontFamily }}>{cell.ref.qText}</div>
    </div>
  );
};

export default TotalsCell;
