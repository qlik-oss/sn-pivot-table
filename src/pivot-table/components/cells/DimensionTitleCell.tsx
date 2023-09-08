import type { stardust } from "@nebula.js/stardust";
import Ascending from "@qlik-trial/sprout/icons/react/Ascending";
import Descending from "@qlik-trial/sprout/icons/react/Descending";
import HeadCellMenu, { MenuAvailabilityFlags } from "@qlik/nebula-table-utils/lib/components/HeadCellMenu";
import type { SearchRelatedArgs } from "@qlik/nebula-table-utils/lib/components/HeadCellMenu/types";
import React, { useMemo, useRef } from "react";
import type {
  Align,
  ChangeActivelySortedHeader,
  ChangeSortOrder,
  Header,
  HeaderCell,
  SortDirection,
} from "../../../types/types";
import { useBaseContext } from "../../contexts/BaseProvider";
import { useStyleContext } from "../../contexts/StyleProvider";
import { getBorderStyle, textStyle } from "../shared-styles";

interface DimensionTitleCellProps {
  cell: HeaderCell;
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
  flexDirection: "row",
  overflow: "hidden",
};

const labelTextStyle: React.CSSProperties = {
  ...textStyle,
  fontWeight: "600",
  alignSelf: "center",
  flexGrow: 1,
  paddingLeft: "8px",
};

export const testId = "title-cell";

const FLAGS = {
  [MenuAvailabilityFlags.SORTING]: true,
  [MenuAvailabilityFlags.SELECTIONS]: true,
};

const DimensionTitleCell = ({
  cell,
  style,
  isLastColumn,
  translator,
  changeSortOrder,
  changeActivelySortedHeader,
}: DimensionTitleCellProps): JSX.Element => {
  const styleService = useStyleContext();
  const { app, model, interactions } = useBaseContext();
  const { fontSize, fontFamily } = styleService.header;
  const anchorRef = useRef<HTMLDivElement>(null);

  const isDim = cell.id !== "PSEUDO-DIM";

  const headerData = useMemo<Header>(
    () => ({
      id: cell.id,
      isDim,
      fieldId: cell.fieldId,
      qLibraryId: cell.qLibraryId,
      label: cell.title,
      headTextAlign: "right" as Align,
      sortDirection: cell.sortDirection,
      colIdx: cell.colIdx,
      qReverseSort: cell.qReverseSort,
      isActivelySorted: cell.isActivelySorted,
    }),
    [cell, isDim],
  );

  const sortFromMenu = async (evt: React.MouseEvent, newSortDirection: SortDirection) => {
    evt.stopPropagation();
    await changeSortOrder(headerData, newSortDirection);
  };

  const sortRelatedArgs = { sortFromMenu, changeActivelySortedHeader };

  const searchRelatedArgs = { interactions } as SearchRelatedArgs;

  const selectionRelatedArgs = { model: model as EngineAPI.IGenericObject, app };

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
        alignItems: "center",
      }}
      data-testid={testId}
    >
      <div style={{ ...labelWrapperStyle }}>
        {cell.isActivelySorted && (
          <div style={{ ...baseFlex, marginLeft: "8px" }}>
            {cell.sortDirection === "A" ? <Ascending height="12px" /> : <Descending height="12px" />}
          </div>
        )}
        <div style={{ ...labelTextStyle, fontSize, fontFamily }}>{cell.title}</div>
      </div>

      {isDim && (
        <>
          <HeadCellMenu
            headerData={headerData}
            translator={translator}
            tabIndex={-1}
            anchorRef={anchorRef}
            menuAvailabilityFlags={FLAGS}
            sortRelatedArgs={sortRelatedArgs}
            searchRelatedArgs={searchRelatedArgs}
            selectionRelatedArgs={selectionRelatedArgs}
          />
          <div style={{ position: "absolute", left: 0, bottom: 0 }} ref={anchorRef} />
        </>
      )}
    </div>
  );
};

export default DimensionTitleCell;
