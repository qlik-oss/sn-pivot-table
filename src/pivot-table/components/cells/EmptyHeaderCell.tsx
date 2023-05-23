import React from "react";

interface Props {
  columnWidths: number[];
}

const innerStyle: React.CSSProperties = {
  backgroundColor: "transparent", // TODO Set via PP or Theme
  height: "100%",
  width: "100%",
};

const EmptyHeaderCell = ({ columnWidths }: Props) => (
  <div
    style={{
      gridColumn: `span ${columnWidths.length}`,
    }}
  >
    <div style={innerStyle} />
  </div>
);

export default EmptyHeaderCell;
