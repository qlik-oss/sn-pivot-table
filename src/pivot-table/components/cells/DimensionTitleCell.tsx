import HeadCellMenu, { MenuAvailabilityFlags } from "@qlik-oss/nebula-table-utils/lib/components/HeadCellMenu";
import React, { useRef, useState } from "react";

import type { stardust } from "@nebula.js/stardust";
import type { Align, ChangeSortOrder, Column, SortDirection } from "../../../types/types";
import { useStyleContext } from "../../contexts/StyleProvider";
import { getBorderStyle, textStyle } from "../shared-styles";

interface LabelCellProps {
  cell: string;
  style: React.CSSProperties;
  isLastColumn: boolean;
  translator: stardust.Translator;
  changeSortOrder: ChangeSortOrder;
  colIndex: number;
  isDim: boolean;
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
  colIndex,
  isDim,
}: LabelCellProps): JSX.Element => {
  const styleService = useStyleContext();
  const { fontSize, fontFamily } = styleService.header;
  const anchorRef = useRef<HTMLDivElement>(null);

  const [qReverseSort, setQReverseSort] = useState(false);

  // TODO:
  // basically we need a unified way of column data in both SNT and PVT
  const mockedColumnData: Column = {
    id: "idOne",
    isDim,
    colIdx: colIndex,
    qReverseSort,
    fieldId: "someFieldId",
    isLocked: false,
    pageColIdx: 0,
    selectionColIdx: 0,
    label: "right",
    headTextAlign: "right" as Align,
    totalsTextAlign: "right" as Align,
    bodyTextAlign: "auto" as Align,
    stylingIDs: ["one", "two"],
    sortDirection: "A" as SortDirection,
    totalInfo: "totlaInfo",
    qApprMaxGlyphCount: 2,
    columnWidth: undefined,
  };

  const sortFromMenu = async (evt: React.MouseEvent) => {
    evt.stopPropagation();
    await changeSortOrder(mockedColumnData);
    setQReverseSort(!qReverseSort);
  };

  return (
    <div
      title={cell}
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
      <div style={{ ...labelTextStyle, fontSize, fontFamily, alignSelf: "center" }}>{cell}</div>

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
            isColumnSorted={false}
            sortFromMenu={sortFromMenu}
          />
          <div style={{ position: "absolute", left: 0, bottom: 0 }} ref={anchorRef} />
        </>
      )}
    </div>
  );
};

export default DimensionTitleCell;
