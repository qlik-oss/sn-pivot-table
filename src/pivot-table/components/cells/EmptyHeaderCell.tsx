import React from "react";
import { useStyleContext } from "../../contexts/StyleProvider";

interface Props {
  rowSpan: number;
  columnSpan: number;
}

const EmptyHeaderCell = ({ rowSpan, columnSpan }: Props) => {
  const styleService = useStyleContext();
  return (
    <div
      style={{
        gridRowStart: 1,
        gridRowEnd: `span ${rowSpan}`,
        gridColumnStart: 1,
        gridColumnEnd: `span ${columnSpan}`,
        background: styleService.grid.background,
      }}
    />
  );
};

export default EmptyHeaderCell;
