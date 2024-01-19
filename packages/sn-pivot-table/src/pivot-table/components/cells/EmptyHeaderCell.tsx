import React from "react";
import { useStyleContext } from "../../contexts/StyleProvider";
import { borderStyle } from "../shared-styles";

interface Props {
  rowSpan: number;
  columnSpan: number;
}
export const testId = "empty-header-cell";

const EmptyHeaderCell = ({ rowSpan, columnSpan }: Props) => {
  const styleService = useStyleContext();
  return rowSpan > 0 && columnSpan > 0 ? (
    <div
      style={{
        ...borderStyle,
        gridRowStart: 1,
        gridRowEnd: `span ${rowSpan}`,
        gridColumnStart: 1,
        gridColumnEnd: `span ${columnSpan}`,
        borderWidth: "0px 1px 0px 0px",
        borderColor: styleService.grid.border,
        background: styleService.grid.background,
      }}
      data-testid={testId}
    />
  ) : null;
};

export default EmptyHeaderCell;
