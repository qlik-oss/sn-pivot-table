import type { stardust } from "@nebula.js/stardust";
import React, { memo } from "react";
import type {
  ChangeActivelySortedHeader,
  ChangeSortOrder,
  DataModel,
  HeaderCell,
  HeadersData,
} from "../../../types/types";
import { useStyleContext } from "../../contexts/StyleProvider";
import type { GetHeaderCellsIconsVisibilityStatus } from "../../hooks/use-column-width";
import DimensionTitleCell from "../cells/DimensionTitleCell";
import EmptyHeaderCell from "../cells/EmptyHeaderCell";

interface HeaderGridProps {
  dataModel: DataModel;
  columnWidthCallback: (index: number) => number;
  rowHight: number;
  headersData: HeadersData;
  translator: stardust.Translator;
  changeSortOrder: ChangeSortOrder;
  changeActivelySortedHeader: ChangeActivelySortedHeader;
  getHeaderCellsIconsVisibilityStatus: GetHeaderCellsIconsVisibilityStatus;
}

const containerStyle: React.CSSProperties = {
  display: "grid",
  background: "red",
};

const HeaderGrid = ({
  dataModel,
  columnWidthCallback,
  rowHight,
  headersData,
  translator,
  changeSortOrder,
  changeActivelySortedHeader,
  getHeaderCellsIconsVisibilityStatus,
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
        const cell = col[col.length - 1] as HeaderCell;
        const iconsVisibilityStatus = getHeaderCellsIconsVisibilityStatus(colIndex, cell.isLocked, cell.title);

        return (
          <DimensionTitleCell
            key={cell.id}
            style={{ width: columnWidths[colIndex], height: rowHight }}
            isLastColumn={colIndex === headersData.size.x - 1}
            translator={translator}
            changeSortOrder={changeSortOrder}
            changeActivelySortedHeader={changeActivelySortedHeader}
            cell={cell}
            iconsVisibilityStatus={iconsVisibilityStatus}
          />
        );
      })}
    </div>
  );
};

export default memo(HeaderGrid);
