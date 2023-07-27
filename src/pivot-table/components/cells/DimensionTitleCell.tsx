import HeadCellMenu, { MenuAvailabilityFlags } from "@qlik-oss/nebula-table-utils/lib/components/HeadCellMenu";
import React, { useRef } from "react";

import type { stardust } from "@nebula.js/stardust";
import { useStyleContext } from "../../contexts/StyleProvider";
import { getBorderStyle, textStyle } from "../shared-styles";

interface LabelCellProps {
  cell: string;
  style: React.CSSProperties;
  isLastColumn: boolean;
  translator: stardust.Translator;
}

export type Align = "left" | "center" | "right";
export type SortDirection = "A" | "D";

const labelTextStyle: React.CSSProperties = {
  ...textStyle,
  fontWeight: "600",
  alignSelf: "flex-end",
  flexGrow: 1,
};

export const testId = "title-cell";

const DimensionTitleCell = ({ cell, style, isLastColumn, translator }: LabelCellProps): JSX.Element => {
  const styleService = useStyleContext();
  const { fontSize, fontFamily } = styleService.header;
  const anchorRef = useRef<HTMLDivElement>(null);

  console.log({ styleService });

  const mockedColumnData = {
    id: "idOne",
    isDim: true,
    fieldId: "someFieldId",
    isLocked: false,
    colIdx: 0,
    pageColIdx: 0,
    selectionColIdx: 0,
    label: "right",
    headTextAlign: "right" as Align,
    totalsTextAlign: "right" as Align,
    bodyTextAlign: "auto" as Align,
    stylingIDs: ["one", "two"],
    sortDirection: "A" as SortDirection,
    qReverseSort: false,
    totalInfo: "totlaInfo",
    qApprMaxGlyphCount: 2,
    columnWidth: undefined,
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
      <HeadCellMenu
        column={mockedColumnData}
        translator={translator}
        tabIndex={-1}
        anchorRef={anchorRef}
        handleHeadCellMenuKeyDown={() => console.log("keyDown")}
        menuAvailabilityFlags={{
          [MenuAvailabilityFlags.SORTING]: true,
        }}
        isColumnSorted={true}
        sortFromMenu={() => console.log("sort from menu")}
      />
      <div style={{ position: "absolute", left: 0, bottom: 0 }} ref={anchorRef} />
    </div>
  );
};

export default DimensionTitleCell;
