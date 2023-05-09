import React, { memo } from "react";
import type { HeaderTitle, HeadersData } from "../../../types/types";
import DimensionTitleCell from "../cells/DimensionTitleCell";

interface HeaderGridProps {
  columnWidthCallback: (index: number) => number;
  rowHight: number;
  headersData: HeadersData;
}

const containerStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "flex-end",
};

const HeaderGrid = ({ columnWidthCallback, rowHight, headersData }: HeaderGridProps): JSX.Element | null => {
  if (headersData.size.x === 0) {
    return null;
  }

  return (
    <div style={containerStyle}>
      {headersData.data.map((col, colIndex) => {
        const cell = col[col.length - 1] as HeaderTitle;

        return (
          <DimensionTitleCell
            key={cell.id}
            cell={cell.title}
            style={{ width: columnWidthCallback(colIndex), height: rowHight }}
            isLastColumn={colIndex === headersData.size.x - 1}
          />
        );
      })}
    </div>
  );
};

export default memo(HeaderGrid);
