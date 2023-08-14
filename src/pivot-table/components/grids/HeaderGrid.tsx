import type { stardust } from "@nebula.js/stardust";
import React, { memo } from "react";
import type { ChangeActivelySortedColumn, ChangeSortOrder, HeaderTitle, HeadersData } from "../../../types/types";
import { useStyleContext } from "../../contexts/StyleProvider";
import DimensionTitleCell from "../cells/DimensionTitleCell";
import EmptyHeaderCell from "../cells/EmptyHeaderCell";

interface HeaderGridProps {
  columnWidthCallback: (index: number) => number;
  rowHight: number;
  headersData: HeadersData;
  translator: stardust.Translator;
  changeSortOrder: ChangeSortOrder;
  changeActivelySortedColumn: ChangeActivelySortedColumn;
}

const containerStyle: React.CSSProperties = {
  display: "grid",
  background: "red",
};

const HeaderGrid = ({
  columnWidthCallback,
  rowHight,
  headersData,
  translator,
  changeSortOrder,
  changeActivelySortedColumn,
}: HeaderGridProps): JSX.Element | null => {
  const styleService = useStyleContext();

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
        background: styleService.header.background,
      }}
    >
      {hasMultipleRows && <EmptyHeaderCell columnWidths={columnWidths} />}
      {headersData.data.map((col, colIndex) => {
        const cell = col[col.length - 1] as HeaderTitle;

        return (
          <DimensionTitleCell
            key={cell.id}
            style={{ width: columnWidths[colIndex], height: rowHight }}
            isLastColumn={colIndex === headersData.size.x - 1}
            translator={translator}
            changeSortOrder={changeSortOrder}
            changeActivelySortedColumn={changeActivelySortedColumn}
            cell={cell}
          />
        );
      })}
    </div>
  );
};

export default memo(HeaderGrid);
