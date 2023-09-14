import type { stardust } from "@nebula.js/stardust";
import React, { memo } from "react";
import type { ChangeActivelySortedHeader, ChangeSortOrder, HeaderCell, HeadersData } from "../../../types/types";
import { useStyleContext } from "../../contexts/StyleProvider";
import type { LeftColumnWidthMeta } from "../../hooks/use-column-width";
import DimensionTitleCell from "../cells/DimensionTitleCell";
import EmptyHeaderCell from "../cells/EmptyHeaderCell";

interface HeaderGridProps {
  getLeftColumnWidth: (index: number) => number;
  rowHight: number;
  headersData: HeadersData;
  translator: stardust.Translator;
  changeSortOrder: ChangeSortOrder;
  changeActivelySortedHeader: ChangeActivelySortedHeader;
  getLeftColumnWidthMeta: (idx: number, isLocked: boolean) => LeftColumnWidthMeta;
}

const containerStyle: React.CSSProperties = {
  display: "grid",
  background: "red",
};

const HeaderGrid = ({
  getLeftColumnWidth,
  rowHight,
  headersData,
  translator,
  changeSortOrder,
  changeActivelySortedHeader,
  getLeftColumnWidthMeta,
}: HeaderGridProps): JSX.Element | null => {
  const styleService = useStyleContext();

  if (headersData.size.x === 0) {
    return null;
  }

  const hasMultipleRows = headersData.size.y > 1;
  const columnWidths = headersData.data.map((_, colIndex) => getLeftColumnWidth(colIndex));
  // headersData.data.map((_, idx) => getLeftColumnWidthMeta(idx));

  return (
    <div
      style={{
        ...containerStyle,
        gridTemplateColumns: columnWidths.map((w) => `${w}px`).join(" "),
        gridTemplateRows: hasMultipleRows ? `1fr ${rowHight}px` : undefined,
        background: styleService.header.background,
      }}
    >
      {hasMultipleRows && <EmptyHeaderCell columnWidths={columnWidths} />}
      {headersData.data.map((col, colIndex) => {
        const cell = col[col.length - 1] as HeaderCell;
        let fakeIsLocked = colIndex % 2 === 0;
        const leftColumnWidthMeta = getLeftColumnWidthMeta(colIndex, fakeIsLocked);

        // console.log(JSON.stringify(colMetadata, null, 2));

        return (
          <DimensionTitleCell
            key={cell.id}
            style={{ width: columnWidths[colIndex], height: rowHight }}
            isLastColumn={colIndex === headersData.size.x - 1}
            translator={translator}
            changeSortOrder={changeSortOrder}
            changeActivelySortedHeader={changeActivelySortedHeader}
            cell={cell}
            isLocked={fakeIsLocked}
            leftColumnWidthMeta={leftColumnWidthMeta}
          />
        );
      })}
    </div>
  );
};

export default memo(HeaderGrid);
