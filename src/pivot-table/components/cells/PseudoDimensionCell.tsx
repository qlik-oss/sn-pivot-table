import React from "react";
import type { Cell, ListItemData, ShowLastBorder } from "../../../types/types";
import { DEFAULT_LINE_CLAMP } from "../../constants";
import { useSelectionsContext } from "../../contexts/SelectionsProvider";
import { useStyleContext } from "../../contexts/StyleProvider";
import {
  getBorderStyle,
  getLineClampStyle,
  getTotalCellDividerStyle,
  leftContainerCellStyle,
  stickyCell,
  textStyle,
  topContainerCellStyle,
} from "../shared-styles";
import ColumnAdjuster from "./ColumnAdjuster";
import shouldRenderColumnAdjuster from "./utils/should-render-column-adjuster";

interface LabelCellProps {
  cell: Cell;
  data: ListItemData;
  style: React.CSSProperties;
  isLeftColumn: boolean;
  isLastRow: boolean;
  isLastColumn: boolean;
  showLastBorder: ShowLastBorder;
  showTotalCellDivider: boolean;
}

const getTextStyle = (clampCount: number): React.CSSProperties => ({
  ...textStyle,
  overflow: "hidden",
  textOverflow: "ellipsis",
  ...getLineClampStyle(clampCount),
});

export const testId = "pseudo-dimension-cell";

const PseudoDimensionCell = ({
  cell,
  data,
  style,
  isLeftColumn,
  isLastRow,
  isLastColumn,
  showLastBorder,
  showTotalCellDivider,
}: LabelCellProps): JSX.Element => {
  const { isActive } = useSelectionsContext();
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
  const containerStyle = isLeftColumn ? leftContainerCellStyle : topContainerCellStyle;
  const totalCellDividerStyle = getTotalCellDividerStyle({
    bottomDivider: showTotalCellDivider && isLeftColumn,
    rightDivider: showTotalCellDivider && !isLeftColumn,
    borderColor: styleService.grid.divider,
  });
  const lineClamp = isLeftColumn ? styleService.content.lineClamp : DEFAULT_LINE_CLAMP;

  const columnAdjuster = shouldRenderColumnAdjuster(cell, isActive) ? (
    <ColumnAdjuster cell={cell} columnWidth={style.width as number} dataModel={data.dataModel} />
  ) : null;

  return (
    <div
      title={cell.ref.qText}
      style={{
        ...style,
        ...getBorderStyle(isLastRow, isLastColumn, styleService.grid.border, showLastBorder),
        ...totalCellDividerStyle,
        ...containerStyle,
        ...serviceStyle,
        zIndex: data.layoutService.size.x - cell.x,
      }}
      data-testid={testId}
    >
      <div style={{ ...getTextStyle(lineClamp), ...stickyCell }}>{cell.ref.qText}</div>
      {columnAdjuster}
    </div>
  );
};

export default PseudoDimensionCell;
