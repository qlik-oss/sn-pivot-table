import React, { memo } from "react";
import type { HeadersData } from "../../../types/types";
import { useStyleContext } from "../../contexts/StyleProvider";
import DimensionTitleCell from "../cells/DimensionTitleCell";
import EmptyHeaderCell from "../cells/EmptyHeaderCell";

interface HeaderGridProps {
  columnWidthCallback: (index: number) => number;
  rowHight: number;
  headersData: HeadersData;
}

export const testId = "header-grid";

const containerStyle: React.CSSProperties = {
  display: "grid",
  background: "red",
};

const HeaderGrid = ({ columnWidthCallback, rowHight, headersData }: HeaderGridProps): JSX.Element | null => {
  const styleService = useStyleContext();

  if (headersData.size.cols === 0) {
    return null;
  }

  const columnWidths = headersData.data[0].map((_, colIndex) => columnWidthCallback(colIndex));

  return (
    <div
      data-testid={testId}
      style={{
        ...containerStyle,
        gridTemplateColumns: columnWidths.map((w) => `${w}px`).join(" "),
        gridTemplateRows: headersData.data.map(() => `${rowHight}px`).join(" "),
        background: styleService.header.background,
      }}
    >
      {headersData.size.rows > 1 && headersData.size.cols > 1 && (
        <EmptyHeaderCell
          style={{
            gridColumn: `span ${headersData.size.cols - 1}`,
            gridRow: `span ${headersData.size.rows - 1}`,
          }}
        />
      )}
      {headersData.data.map((row, rowIndex) =>
        row.reduce((previousValue: JSX.Element[], cell, colIndex) => {
          if (cell) {
            const gridArea = `${rowIndex + 1} / ${colIndex + 1}`;

            previousValue.push(
              <DimensionTitleCell
                key={cell.id}
                title={cell.title}
                type={cell.type}
                style={{
                  gridArea,
                }}
                isLastRow={rowIndex === headersData.size.rows - 1}
                isLastColumn={colIndex === headersData.size.cols - 1}
                isFirstColumn={colIndex === 0}
              />
            );
          }
          return previousValue;
        }, [])
      )}
    </div>
  );
};

export default memo(HeaderGrid);
