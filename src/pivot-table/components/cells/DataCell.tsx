import React from "react";
import { areEqual } from "react-window";
import type { GridItemData } from "../../../types/types";
import { useStyleContext } from "../../contexts/StyleProvider";
import { getBorderStyle, getTotalCellDividerStyle } from "../shared-styles";
import EmptyCell from "./EmptyCell";
import { containerStyle, getCellStyle, getTextStyle } from "./utils/get-measure-cell-style";

export interface MeasureCellProps {
  columnIndex: number;
  rowIndex: number;
  style: React.CSSProperties;
  data: GridItemData;
}

export const testId = "measure-cell";

const MeasureCell = ({ columnIndex, rowIndex, style, data }: MeasureCellProps): JSX.Element | null => {
  const styleService = useStyleContext();
  const { background } = styleService.measureValues;
  const {
    grid,
    layoutService,
    showLastBorder,
    shouldShowTotalCellBottomDivider,
    shouldShowTotalCellRightDivider,
    isTotalValue,
  } = data;
  const cell = grid[rowIndex]?.[columnIndex];
  const isLastRow = rowIndex === layoutService.size.y - 1;
  const isLastColumn = columnIndex === layoutService.size.x - 1;

  if (!cell) {
    return (
      <EmptyCell
        style={{ ...style, background }}
        isLastRow={isLastRow}
        isLastColumn={isLastColumn}
        showLastBorder={showLastBorder}
        index={rowIndex}
        isLeftColumn={false}
        showTotalCellDivider={false}
      />
    );
  }

  const isTotalValueCell = !cell.isNull && isTotalValue(columnIndex, rowIndex);
  const text = cell.isNull ? layoutService.getNullValueText() : cell.ref.qText;
  const isNumeric = cell.isNull ? !Number.isNaN(+text) : true;
  const cellStyle = {
    ...getCellStyle(styleService, cell.isNull, isTotalValueCell, cell.expressionColor.background),
    ...getBorderStyle(isLastRow, isLastColumn, styleService.grid.border, showLastBorder),
    ...getTotalCellDividerStyle({
      bottomDivider: shouldShowTotalCellBottomDivider(rowIndex),
      rightDivider: shouldShowTotalCellRightDivider(columnIndex),
      borderColor: styleService.grid.divider,
    }),
    display: "flex",
    justifyContent: isNumeric ? "flex-end" : "center",
  };

  return (
    <div
      title={text}
      style={{ ...style, ...containerStyle }}
      data-testid={testId}
      data-row-index={rowIndex}
      data-col-index={columnIndex}
    >
      <div style={cellStyle}>
        <span style={getTextStyle(styleService, cell.expressionColor.color, isNumeric, isTotalValueCell, cell.isNull)}>
          {text}
        </span>
      </div>
    </div>
  );
};

export default React.memo(MeasureCell, areEqual);
