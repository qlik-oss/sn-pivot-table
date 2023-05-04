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
  fontStyle: "italic",
};

export const testId = "title-cell";

const DimensionTitleCell = ({ cell, style, isLastColumn }: LabelCellProps): JSX.Element => {
  const styleService = useStyleContext();

  return (
    <div title={cell} style={{ ...style, ...getBorderStyle(true, isLastColumn), display: "flex" }} data-testid={testId}>
      <div style={{ ...labelTextStyle, ...styleService.header, alignSelf: "flex-end", flexGrow: 1 }}>{cell}</div>
    </div>
  );
};

export default DimensionTitleCell;
