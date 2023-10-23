import type { stardust } from "@nebula.js/stardust";
import React, { memo } from "react";
import type { ChangeActivelySortedHeader, ChangeSortOrder, HeadersData } from "../../../types/types";
import type { GetHeaderCellsIconsVisibilityStatus } from "../../hooks/use-column-width";
import DimensionTitleCell from "../cells/DimensionTitleCell";
import EmptyHeaderCell from "../cells/EmptyHeaderCell";

interface HeaderGridProps {
  columnWidths: number[];
  rowHight: number;
  headersData: HeadersData;
  translator: stardust.Translator;
  changeSortOrder: ChangeSortOrder;
  changeActivelySortedHeader: ChangeActivelySortedHeader;
  getHeaderCellsIconsVisibilityStatus: GetHeaderCellsIconsVisibilityStatus;
  height: number;
}

const containerStyle: React.CSSProperties = {
  display: "grid",
  width: "fit-content",
};

const HeaderGrid = ({
  columnWidths,
  rowHight,
  headersData,
  translator,
  changeSortOrder,
  changeActivelySortedHeader,
  getHeaderCellsIconsVisibilityStatus,
  height,
}: HeaderGridProps): JSX.Element | null => (
  <div
    style={{
      ...containerStyle,
      gridTemplateColumns: columnWidths.map((w) => `${w}px`).join(" "),
      gridTemplateRows: headersData.data.map(() => `${rowHight}px`).join(" "),
      height,
    }}
  >
    {headersData.size.y > 1 && <EmptyHeaderCell columnSpan={columnWidths.length} rowSpan={headersData.size.y - 1} />}
    {headersData.data.map((row, rowIndex) =>
      row.reduce((acc, cell, colIndex) => {
        if (cell) {
          const iconsVisibilityStatus = getHeaderCellsIconsVisibilityStatus(colIndex, cell.isLocked, cell.label);
          acc.push(
            <DimensionTitleCell
              key={cell.id}
              style={{
                width: columnWidths[colIndex],
                height: rowHight,
                gridColumn: colIndex + 1,
                gridRow: rowIndex + 1,
              }}
              isLastColumn={colIndex === headersData.size.x - 1}
              translator={translator}
              changeSortOrder={changeSortOrder}
              changeActivelySortedHeader={changeActivelySortedHeader}
              cell={cell}
              iconsVisibilityStatus={iconsVisibilityStatus}
            />,
          );
        }
        return acc;
      }, [] as React.JSX.Element[]),
    )}
  </div>
);

export default memo(HeaderGrid);
