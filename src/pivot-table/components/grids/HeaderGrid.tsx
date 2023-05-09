import React, { memo } from "react";
import type { HeadersData } from "../../../types/types";
import DimensionTitleCell from "../cells/DimensionTitleCell";
import { EmptyHeaderCell } from "../cells/EmptyHeaderCell";

interface HeaderGridProps {
  columnWidthCallback: (index: number) => number;
  rowHight: number;
  headersData: HeadersData;
}

const containerStyle: React.CSSProperties = {
  display: "grid",
};

const HeaderGrid = ({ columnWidthCallback, rowHight, headersData }: HeaderGridProps): JSX.Element | null => {
  if (headersData.size.x === 0) {
    return null;
  }

  const hasMultipleRows = headersData.size.y > 1;
  const columnWidths = headersData.data.map((_, colIndex) => columnWidthCallback(colIndex));

  return (
    <div
      style={{
        ...containerStyle,
        gridTemplateColumns: columnWidths.map((w) => `${w}px`).join(" "),
        gridTemplateRows: hasMultipleRows ? `1fr ${rowHight}px` : undefined,
      }}
    >
      {hasMultipleRows && <EmptyHeaderCell columnWidths={columnWidths} />}
      {headersData.data.map((col, colIndex) => (
        <DimensionTitleCell
          // eslint-disable-next-line react/no-array-index-key
          key={`${colIndex}-${col[col.length - 1] as string}`} // TODO Use a better key
          cell={col[col.length - 1] as string}
          style={{ width: columnWidths[colIndex], height: rowHight }}
          isLastColumn={colIndex === headersData.size.x - 1}
        />
      ))}
    </div>
  );
};

export default memo(HeaderGrid);
