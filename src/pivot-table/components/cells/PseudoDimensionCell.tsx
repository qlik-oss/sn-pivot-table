import React from "react";
import type { Cell, ListItemData, ShowLastBorder } from "../../../types/types";
import { DEFAULT_LINE_CLAMP } from "../../constants";
import { useSelectionsContext } from "../../contexts/SelectionsProvider";
import { useStyleContext } from "../../contexts/StyleProvider";
import {
  CELL_PADDING,
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
  const { fontSize, fontFamily } = styleService.dimensionValues;
  const { fontWeight, fontStyle, textDecoration, ...measureLabelStyle } = styleService.measureLabels;
  const containerStyle = isLeftColumn ? leftContainerCellStyle : topContainerCellStyle;
  const totalCellDividerStyle = getTotalCellDividerStyle({
    bottomDivider: showTotalCellDivider && isLeftColumn,
    rightDivider: showTotalCellDivider && !isLeftColumn,
    borderColor: styleService.grid.divider,
  });
  const lineClamp = isLeftColumn ? styleService.grid.lineClamp : DEFAULT_LINE_CLAMP;

  const columnAdjuster = shouldRenderColumnAdjuster(cell, isActive) ? (
    <ColumnAdjuster
      cell={cell}
      columnWidth={style.width as number}
      dataModel={data.dataModel}
      isLastColumn={isLastColumn}
    />
  ) : null;

  return (
    <div
      title={cell.ref.qText}
      style={{
        ...style,
        ...getBorderStyle(isLastRow, isLastColumn, styleService.grid.border, showLastBorder),
        ...totalCellDividerStyle,
        ...containerStyle,
        ...measureLabelStyle,
        zIndex: data.layoutService.size.x - cell.x,
      }}
      data-testid={testId}
    >
      <span
        style={{
          ...getTextStyle(lineClamp),
          ...stickyCell,
          ...(!isLeftColumn && { right: CELL_PADDING }),
          fontSize,
          fontFamily,
          fontWeight,
          fontStyle,
          textDecoration,
        }}
      >
        {cell.ref.qText}
      </span>
      {columnAdjuster}
    </div>
  );
};

export default PseudoDimensionCell;
