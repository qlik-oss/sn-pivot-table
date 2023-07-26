import React from "react";
import { useStyleContext } from "../../contexts/StyleProvider";
import { getBorderStyle, textStyle } from "../shared-styles";

interface LabelCellProps {
  cell: string;
  style: React.CSSProperties;
  isLastColumn: boolean;
}

const labelTextStyle: React.CSSProperties = {
  ...textStyle,
  fontWeight: "600",
  alignSelf: "flex-end",
  flexGrow: 1,
};

export const testId = "title-cell";

const DimensionTitleCell = ({ cell, style, isLastColumn }: LabelCellProps): JSX.Element => {
  const styleService = useStyleContext();
  const { fontSize, fontFamily } = styleService.header;

  return (
    <div
      title={cell}
      style={{
        ...style,
        ...getBorderStyle(true, isLastColumn, styleService.grid.border, false),
        ...styleService.header.rowTitle,
        display: "flex",
      }}
      data-testid={testId}
    >
      <div style={{ ...labelTextStyle, fontSize, fontFamily }}>{cell}</div>
    </div>
  );
};

export default DimensionTitleCell;
