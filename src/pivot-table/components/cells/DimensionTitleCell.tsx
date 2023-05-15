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

const backgroundColor = "rgba(0, 0, 0, 0.02)"; // TODO Set from PP or Theme

export const testId = "title-cell";

const DimensionTitleCell = ({ cell, style, isLastColumn }: LabelCellProps): JSX.Element => {
  const styleService = useStyleContext();

  return (
    <div
      title={cell}
      style={{
        ...style,
        ...getBorderStyle(true, isLastColumn),
        display: "flex",
        backgroundColor,
      }}
      data-testid={testId}
    >
      <div style={{ ...labelTextStyle, ...styleService.header }}>{cell}</div>
    </div>
  );
};

export default DimensionTitleCell;
