import React from "react";
import type { Cell, ListItemData, ShowLastBorder } from "../../../types/types";
import { DEFAULT_LINE_CLAMP } from "../../constants";
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

interface LabelCellProps {
  cell: Cell;
  style: React.CSSProperties;
  isLeftColumn: boolean;
  isLastRow: boolean;
  isLastColumn: boolean;
  showLastBorder: ShowLastBorder;
  showTotalCellDivider: boolean;
  data: ListItemData;
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
  style,
  isLeftColumn,
  isLastRow,
  isLastColumn,
  showLastBorder,
  showTotalCellDivider,
  data,
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
  const containerStyle = isLeftColumn ? leftContainerCellStyle : topContainerCellStyle;
  const totalCellDividerStyle = getTotalCellDividerStyle({
    bottomDivider: showTotalCellDivider && isLeftColumn,
    rightDivider: showTotalCellDivider && !isLeftColumn,
    borderColor: styleService.grid.divider,
  });
  const lineClamp = isLeftColumn ? styleService.content.lineClamp : DEFAULT_LINE_CLAMP;

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
      {data.dataModel && !isLeftColumn && isLastRow && (
        <ColumnAdjuster
          cell={cell}
          columnWidth={style.width as number}
          applyColumnWidth={data.dataModel.applyColumnWidth}
        />
      )}
    </div>
  );
};

export default PseudoDimensionCell;
