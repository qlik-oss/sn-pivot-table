import React from "react";
import { areEqual } from "react-window";
import NxDimCellType from "../../../types/QIX";
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
  const { background } = styleService.content;
  const {
    grid,
    layoutService,
    showLastRowBorderBottom,
    shouldShowTotalCellBottomDivider,
    shouldShowTotalCellRightDivider,
    isTotalCellAt,
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
        showLastRowBorderBottom={showLastRowBorderBottom}
        index={rowIndex}
        cell={undefined}
        isLeftColumn={false}
      />
    );
  }

  const { qText, qType } = cell;
  const isNull = qType === NxDimCellType.NX_DIM_CELL_NULL;
  const isTotalCell = !isNull && isTotalCellAt(columnIndex, rowIndex);
  const text = isNull ? layoutService.getNullValueText() : qText;
  const isNumeric = isNull ? !Number.isNaN(+text) : true;
  const cellStyle = {
    ...getCellStyle(styleService, isNull, isTotalCell),
    ...getBorderStyle(isLastRow, isLastColumn, styleService.grid.border, showLastRowBorderBottom),
    ...getTotalCellDividerStyle({
      bottomDivider: shouldShowTotalCellBottomDivider(rowIndex),
      rightDivider: shouldShowTotalCellRightDivider(columnIndex),
      borderColor: styleService.grid.divider,
    }),
    display: "flex",
    justifyContent: isNumeric ? "flex-end" : "center",
  };

  return (
    <div title={text} style={{ ...style, ...containerStyle }} data-testid={testId}>
      <div style={cellStyle}>
        <span style={getTextStyle(styleService, isNumeric)}>{text}</span>
      </div>
    </div>
  );
};

export default React.memo(MeasureCell, areEqual);
