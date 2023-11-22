import type { stardust } from "@nebula.js/stardust";
import React, { memo } from "react";
import type { ChangeActivelySortedHeader, ChangeSortOrder, DataModel, HeadersData } from "../../../types/types";
import type { GetHeaderCellsIconsVisibilityStatus, OverrideLeftGridWidth } from "../../hooks/use-column-width/types";
import DimensionTitleCell from "../cells/DimensionTitleCell";
import EmptyHeaderCell from "../cells/EmptyHeaderCell";

interface HeaderGridProps {
  dataModel: DataModel;
  columnWidths: number[];
  rowHight: number;
  headersData: HeadersData;
  translator: stardust.Translator;
  changeSortOrder: ChangeSortOrder;
  changeActivelySortedHeader: ChangeActivelySortedHeader;
  getHeaderCellsIconsVisibilityStatus: GetHeaderCellsIconsVisibilityStatus;
  height: number;
  overrideLeftGridWidth: OverrideLeftGridWidth;
}

const containerStyle: React.CSSProperties = {
  display: "grid",
  width: "fit-content",
};

const HeaderGrid = ({
  dataModel,
  columnWidths,
  rowHight,
  headersData,
  translator,
  changeSortOrder,
  changeActivelySortedHeader,
  getHeaderCellsIconsVisibilityStatus,
  height,
  overrideLeftGridWidth,
}: HeaderGridProps): JSX.Element | null => (
  <div
    style={{
      ...containerStyle,
      gridTemplateColumns: columnWidths.map((w) => `${w}px`).join(" "),
      gridTemplateRows: headersData.data.map(() => `${rowHight}px`).join(" "),
      height,
    }}
  >
    {headersData.size.y > 1 && <EmptyHeaderCell columnSpan={headersData.size.x - 1} rowSpan={headersData.size.y - 1} />}
    {headersData.data.map((row, rowIndex) =>
      row.reduce((acc, cell, colIndex) => {
        if (cell) {
          const iconsVisibilityStatus = getHeaderCellsIconsVisibilityStatus(colIndex, cell.isLocked, cell.label);
          acc.push(
            <DimensionTitleCell
              dataModel={dataModel}
              key={cell.id}
              style={{
                width: columnWidths[colIndex],
                height: rowHight,
                gridColumn: colIndex + 1,
                gridRow: rowIndex + 1,
                zIndex: headersData.size.x - colIndex,
              }}
              isLastRow={rowIndex === headersData.size.y - 1}
              isFirstColumn={colIndex === 0}
              isLastColumn={colIndex === headersData.size.x - 1}
              translator={translator}
              changeSortOrder={changeSortOrder}
              changeActivelySortedHeader={changeActivelySortedHeader}
              cell={cell}
              iconsVisibilityStatus={iconsVisibilityStatus}
              columnWidth={columnWidths[colIndex]}
              overrideLeftGridWidth={overrideLeftGridWidth}
            />,
          );
        }
        return acc;
      }, [] as React.JSX.Element[]),
    )}
  </div>
);

export default memo(HeaderGrid);
