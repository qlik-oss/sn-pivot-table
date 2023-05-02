import React, { memo } from "react";
import { HeadersData } from "../../../types/types";
import DimensionTitleCell from "../cells/DimensionTitleCell";

interface HeaderGridProps {
  columnWidthCallback: (index: number) => number;
  rowHight: number;
  headersData: HeadersData;
}

const HeaderGrid = ({ columnWidthCallback, rowHight, headersData }: HeaderGridProps): JSX.Element | null => {
  if (headersData.size.x === 0) {
    return null;
  }

  return (
    <div style={{ display: "flex", alignItems: "end" }}>
      {headersData.data.map((col, colIndex) => (
        <DimensionTitleCell
          cell={col[col.length - 1] as string}
          style={{ width: columnWidthCallback(colIndex), height: rowHight }}
          isLastColumn={colIndex === headersData.size.x - 1}
        />
      ))}
    </div>
  );
};

export default memo(HeaderGrid);
