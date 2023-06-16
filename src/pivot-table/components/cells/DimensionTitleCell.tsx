import React from "react";
import type { HeaderType } from "../../../types/types";
import { useStyleContext } from "../../contexts/StyleProvider";
import { getHeaderBorderStyle, textStyle } from "../shared-styles";

interface LabelCellProps {
  title: string;
  type: HeaderType;
  style: React.CSSProperties;
  isLastRow: boolean;
  isLastColumn: boolean;
  isFirstColumn: boolean;
}

const labelTextStyle: React.CSSProperties = {
  ...textStyle,
  fontWeight: "600",
  alignSelf: "flex-end",
  flexGrow: 1,
};

export const testId = "title-cell";

const DimensionTitleCell = ({
  title,
  type,
  style,
  isLastRow,
  isLastColumn,
  isFirstColumn,
}: LabelCellProps): JSX.Element => {
  const styleService = useStyleContext();
  const { fontSize, fontFamily } = styleService.header;
  const headerStyle = type === "left" ? styleService.header.rowTitle : styleService.header.columnTitle;

  return (
    <div
      title={title}
      style={{
        ...style,
        ...getHeaderBorderStyle(isLastRow, isLastColumn, isFirstColumn, styleService.grid.border, type),
        ...headerStyle,
        display: "flex",
      }}
      data-testid={testId}
    >
      <div style={{ ...labelTextStyle, fontSize, fontFamily }}>{title}</div>
    </div>
  );
};

export default DimensionTitleCell;
