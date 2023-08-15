import HeadCellMenu, { MenuAvailabilityFlags } from "@qlik-oss/nebula-table-utils/lib/components/HeadCellMenu";
import React, { useRef, useState } from "react";

import type { stardust } from "@nebula.js/stardust";
import type {
  Align,
  ChangeActivelySortedColumn,
  ChangeSortOrder,
  Column,
  HeaderTitle,
  HeadersData,
  SortDirection,
} from "../../../types/types";
import { useStyleContext } from "../../contexts/StyleProvider";
import { getBorderStyle, textStyle } from "../shared-styles";

interface LabelCellProps {
  cell: HeaderTitle;
  style: React.CSSProperties;
  isLastColumn: boolean;
  translator: stardust.Translator;
  changeSortOrder: ChangeSortOrder;
  changeActivelySortedColumn: ChangeActivelySortedColumn;
}

const labelTextStyle: React.CSSProperties = {
  ...textStyle,
  fontWeight: "600",
  alignSelf: "flex-end",
  flexGrow: 1,
};

export const testId = "title-cell";

const DimensionTitleCell = ({
  cell,
  style,
  isLastColumn,
  translator,
  changeSortOrder,
  changeActivelySortedColumn,
}: LabelCellProps): JSX.Element => {
  const styleService = useStyleContext();
  const { fontSize, fontFamily } = styleService.header;
  const anchorRef = useRef<HTMLDivElement>(null);

  const isDim = cell.id !== "PSEUDO-DIM";

  // TODO:
  // basically we need a unified way of column data in both SNT and PVT
  const mockedColumnData: Column = {
    id: cell.id,
    isDim,
    fieldId: cell.fieldId,
    qLibraryId: cell.qLibraryId,
    label: "right",
    headTextAlign: "right" as Align,
    sortDirection: cell.sortDirection,

    colIdx: cell.colIdx,
    qReverseSort: cell.qReverseSort,
    isActivelySorted: cell.isActivelySorted,
  };

  const sortFromMenu = async (evt: React.MouseEvent, newSortDirection: SortDirection) => {
    evt.stopPropagation();
    await changeSortOrder(mockedColumnData, newSortDirection);
  };

  return (
    <div
      title={cell.title}
      style={{
        ...style,
        ...getBorderStyle(true, isLastColumn, styleService.grid.border, false),
        ...styleService.header.rowTitle,
        padding: 0,
        position: "relative",
        display: "grid",
        gridTemplateColumns: "1fr 24px",
        gridGap: "4px",
      }}
      data-testid={testId}
    >
      <div style={{ ...labelTextStyle, fontSize, fontFamily, alignSelf: "center" }}>{cell.title}</div>

      {isDim && (
        <>
          {/* TODO: fix typing
          // @ts-ignore */}
          <HeadCellMenu
            column={mockedColumnData}
            translator={translator}
            tabIndex={-1}
            anchorRef={anchorRef}
            handleHeadCellMenuKeyDown={() => console.log("keyDown")}
            menuAvailabilityFlags={{
              [MenuAvailabilityFlags.SORTING]: true,
            }}
            sortFromMenu={sortFromMenu}
            changeActivelySortedColumn={changeActivelySortedColumn}
          />
          <div style={{ position: "absolute", left: 0, bottom: 0 }} ref={anchorRef} />
        </>
      )}
    </div>
  );
};

export default DimensionTitleCell;
