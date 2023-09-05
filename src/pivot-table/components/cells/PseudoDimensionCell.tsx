import React from "react";
import type { Cell } from "../../../types/types";
import { useStyleContext } from "../../contexts/StyleProvider";
import { shouldShowTotalCellDivider } from "../../hooks/use-is-total-cell";
import { getBorderStyle, getLineClampStyle, getTotalCellDividerStyle, stickyCell, textStyle } from "../shared-styles";

interface LabelCellProps {
  cell: Cell;
  style: React.CSSProperties;
  isLeftColumn: boolean;
  isLastRow: boolean;
  isLastColumn: boolean;
  showLastRowBorderBottom: boolean;
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

const PseudoDimensionCell = ({
  cell,
  style,
  isLeftColumn,
  isLastRow,
  isLastColumn,
  showLastRowBorderBottom,
}: LabelCellProps): JSX.Element => {
  const styleService = useStyleContext();
  const serviceStyle = isLeftColumn
    ? {
        fontSize: styleService.rowContent.fontSize,
        fontFamily: styleService.rowContent.fontFamily,
        ...styleService.rowContent.measureLabel,
      }
    : {
        fontSize: styleService.columnContent.fontSize,
        fontFamily: styleService.columnContent.fontFamily,
        ...styleService.columnContent.measureLabel,
      };
  const containerStyle = isLeftColumn ? leftContainerStyle : topContainerStyle;
  const showTotalCellDivider = shouldShowTotalCellDivider(cell);
  const totalCellDividerStyle = getTotalCellDividerStyle({
    bottomDivider: showTotalCellDivider && isLeftColumn,
    rightDivider: showTotalCellDivider && !isLeftColumn,
    borderColor: styleService.grid.divider,
  });

  return (
    <div
      title={cell.ref.qText}
      style={{
        ...style,
        ...getBorderStyle(isLastRow, isLastColumn, styleService.grid.border, showLastRowBorderBottom),
        ...totalCellDividerStyle,
        ...containerStyle,
        ...serviceStyle,
      }}
      data-testid={testId}
    >
      <div style={{ ...getTextStyle(styleService.lineClamp), ...stickyCell }}>{cell.ref.qText}</div>
    </div>
  );
};

export default PseudoDimensionCell;
