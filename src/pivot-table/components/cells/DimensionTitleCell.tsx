import type { stardust } from "@nebula.js/stardust";
import Ascending from "@qlik-trial/sprout/icons/react/Ascending";
import Descending from "@qlik-trial/sprout/icons/react/Descending";
import HeadCellMenu, { MenuAvailabilityFlags } from "@qlik/nebula-table-utils/lib/components/HeadCellMenu";
import React, { useRef } from "react";
import type {
  Align,
  ChangeActivelySortedHeader,
  ChangeSortOrder,
  Column,
  HeaderTitle,
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
  changeActivelySortedHeader: ChangeActivelySortedHeader;
}

const baseFlex: React.CSSProperties = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

const labelWrapperStyle: React.CSSProperties = {
  ...baseFlex,
  width: "fit-content",
  flexDirection: "row",
};

const labelTextStyle: React.CSSProperties = {
  ...textStyle,
  fontWeight: "600",
  alignSelf: "center",
  flexGrow: 1,
  paddingLeft: "8px",
};

export const testId = "title-cell";

const DimensionTitleCell = ({
  cell,
  style,
  isLastColumn,
  translator,
  changeSortOrder,
  changeActivelySortedHeader,
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
      <div style={{ ...labelWrapperStyle }}>
        <div style={{ ...labelTextStyle, fontSize, fontFamily }}>{cell.title}</div>
        {cell.isActivelySorted && (
          <div style={{ ...baseFlex, marginLeft: "8px" }}>
            {cell.sortDirection === "A" ? <Ascending height="12px" /> : <Descending height="12px" />}
          </div>
        )}
      </div>

      {isDim && (
        <>
          <HeadCellMenu
            headerData={mockedColumnData}
            translator={translator}
            tabIndex={-1}
            anchorRef={anchorRef}
            handleHeadCellMenuKeyDown={() => console.log("keyDown")}
            menuAvailabilityFlags={{
              [MenuAvailabilityFlags.SORTING]: true,
            }}
            sortRelatedArgs={{ sortFromMenu, changeActivelySortedHeader }}
          />
          <div style={{ position: "absolute", left: 0, bottom: 0 }} ref={anchorRef} />
        </>
      )}
    </div>
  );
};

export default DimensionTitleCell;
