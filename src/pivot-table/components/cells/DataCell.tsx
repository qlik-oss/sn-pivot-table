import React from "react";
import { areEqual } from "react-window";
import NxDimCellType from "../../../types/QIX";
import type { GridItemData } from "../../../types/types";
import { useStyleContext } from "../../contexts/StyleProvider";
import { getBorderStyle, getLineClampStyle, textStyle } from "../shared-styles";
import EmptyCell from "./EmptyCell";

export interface MeasureCellProps {
  columnIndex: number;
  rowIndex: number;
  style: React.CSSProperties;
  data: GridItemData;
}

const numericStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  height: "100%",
};

const nilStyle: React.CSSProperties = {
  alignItems: "center",
  backgroundColor: "#f2f2f2",
  display: "flex",
  flexDirection: "row",
  height: "100%",
  backgroundClip: "padding-box",
};

const containerStyle: React.CSSProperties = {
  color: "rgb(89, 89, 89)",
  justifyContent: "center",
};

const getGridTextClampStyle = (clampCount: number): React.CSSProperties => ({
  overflow: "hidden",
  textOverflow: "ellipsis",
  ...getLineClampStyle(clampCount),
});

export const testId = "measure-cell";

const MeasureCell = ({ columnIndex, rowIndex, style, data }: MeasureCellProps): JSX.Element | null => {
  const styleService = useStyleContext();
  const { grid, layoutService } = data;
  const cell = grid[rowIndex]?.[columnIndex];
  const isLastRow = rowIndex === layoutService.size.y - 1;
  const isLastColumn = columnIndex === layoutService.size.x - 1;

  if (!cell) {
    return <EmptyCell style={style} isLastRow={isLastRow} isLastColumn={isLastColumn} />;
  }

  const { qText, qType } = cell;
  const isNull = qType === NxDimCellType.NX_DIM_CELL_NULL;
  const text = isNull ? layoutService.getNullValueText() : qText;
  const isNumeric = isNull ? !Number.isNaN(+text) : true;
  const cellStyle = {
    ...(isNull ? nilStyle : numericStyle),
    ...getBorderStyle(isLastRow, isLastColumn),
    display: "flex",
    justifyContent: isNumeric ? "flex-end" : "center",
  };

  return (
    <div title={text} style={{ ...style, ...containerStyle }} data-testid={testId}>
      <div style={cellStyle}>
        <span
          style={{
            ...textStyle,
            ...styleService.content,
            ...(!isNumeric && getGridTextClampStyle(styleService.lineClamp)),
            alignSelf: "flex-start",
          }}
        >
          {text}
        </span>
      </div>
    </div>
  );
};

export default React.memo(MeasureCell, areEqual);
