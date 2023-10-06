import React from "react";
import type { Cell, ShowLastBorder } from "../../../types/types";
import { BOLD_FONT_WEIGHT } from "../../constants";
import { useStyleContext } from "../../contexts/StyleProvider";
import {
  getBorderStyle,
  getTotalCellDividerStyle,
  leftContainerCellStyle,
  stickyCell,
  textStyle,
  topContainerCellStyle,
} from "../shared-styles";

interface LabelCellProps {
  style: React.CSSProperties;
  cell: Cell;
  isLeftColumn: boolean;
  isLastRow: boolean;
  isLastColumn: boolean;
  showTotalCellDivider: boolean;
  showLastBorder: ShowLastBorder;
}

const labelTextStyle: React.CSSProperties = {
  ...textStyle,
  fontWeight: BOLD_FONT_WEIGHT,
};

export const testId = "totals-cell";

const TotalsCell = ({
  cell,
  style,
  isLeftColumn,
  isLastRow,
  isLastColumn,
  showTotalCellDivider,
  showLastBorder,
}: LabelCellProps): JSX.Element => {
  const styleService = useStyleContext();
  const serviceStyle = isLeftColumn ? styleService.rowContent.totalLabel : styleService.columnContent.totalLabel;
  const { fontSize, fontFamily } = isLeftColumn ? styleService.rowContent : styleService.columnContent;
  const containerStyle = isLeftColumn ? leftContainerCellStyle : topContainerCellStyle;

  const totalCellDividerStyle = getTotalCellDividerStyle({
    bottomDivider: showTotalCellDivider && isLeftColumn,
    rightDivider: showTotalCellDivider && !isLeftColumn,
    borderColor: styleService.grid.divider,
  });

  return (
    <div
      style={{
        ...style,
        ...containerStyle,
        ...getBorderStyle(isLastRow, isLastColumn, styleService.grid.border, showLastBorder),
        ...serviceStyle,
        ...totalCellDividerStyle,
      }}
      data-testid={testId}
    >
      <div style={{ ...labelTextStyle, ...stickyCell, fontSize, fontFamily }}>{cell.ref.qText}</div>
    </div>
  );
};

export default TotalsCell;
