import React from "react";
import { areEqual } from "react-window";
import type { GridItemData } from "../../../types/types";
import { useStyleContext } from "../../contexts/StyleProvider";
import getExpressionColor from "../../data/helpers/get-expression-color";
import { baseCellStyle, getBorderStyle, getTotalCellDividerStyle } from "../shared-styles";
import EmptyCell from "./EmptyCell";
import { containerStyle, getCellStyle, getTextStyle } from "./utils/get-measure-cell-style";
import getMeasureInfoIndex from "./utils/get-measure-info-index";

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
    pageInfo,
    lastRow,
    lastColumn,
    attrExprInfoIndexes,
  } = data;
  const cell = grid[rowIndex]?.[columnIndex];
  const isLastRow = rowIndex === pageInfo.rowsOnCurrentPage - 1;
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
  const measureInfoIndex = layoutService.hasPseudoDimOnLeft
    ? getMeasureInfoIndex(lastColumn, rowIndex)
    : getMeasureInfoIndex(lastRow, columnIndex);
  const expressionColor = getExpressionColor(attrExprInfoIndexes[measureInfoIndex], cell.ref);
  const cellStyle = {
    ...getCellStyle(styleService, cell.isNull, isTotalValueCell, expressionColor.background),
    ...getBorderStyle(isLastRow, isLastColumn, styleService.grid.border, showLastBorder),
    ...getTotalCellDividerStyle({
      bottomDivider: shouldShowTotalCellBottomDivider(rowIndex),
      rightDivider: shouldShowTotalCellRightDivider(columnIndex),
      borderColor: styleService.grid.divider,
    }),
    ...baseCellStyle,
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
        <span style={getTextStyle(styleService, expressionColor.color, isNumeric, isTotalValueCell, cell.isNull)}>
          {measureInfoIndex}
        </span>
      </div>
    </div>
  );
};

export default React.memo(MeasureCell, areEqual);
