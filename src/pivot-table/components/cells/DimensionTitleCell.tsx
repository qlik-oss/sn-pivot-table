/* eslint jsx-a11y/click-events-have-key-events: 0, jsx-a11y/no-static-element-interactions: 0 */
import type { stardust } from "@nebula.js/stardust";
import Locked from "@qlik-trial/sprout/icons/react/Lock";
import HeadCellMenu, { MenuAvailabilityFlags } from "@qlik/nebula-table-utils/lib/components/HeadCellMenu";
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
import type { GetLeftColumnWidthMetadata } from "../../hooks/use-column-width";
import { useHeadCellDim } from "../../hooks/use-head-cell-dim";
import { getBorderStyle, textStyle } from "../shared-styles";
import { StyledHeaderAnchor, StyledHeaderCellWrapper } from "./styles";

interface DimensionTitleCellProps {
  cell: HeaderCell;
  style: React.CSSProperties;
  isLastColumn: boolean;
  translator: stardust.Translator;
  changeSortOrder: ChangeSortOrder;
  changeActivelySortedHeader: ChangeActivelySortedHeader;
  columnWidthMetadata: ReturnType<GetLeftColumnWidthMetadata>;
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
  position: "relative",
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
  [MenuAvailabilityFlags.SEARCHING]: true,
};

const DimensionTitleCell = ({
  cell,
  style,
  isLastColumn,
  translator,
  changeSortOrder,
  changeActivelySortedHeader,
  columnWidthMetadata,
}: DimensionTitleCellProps): JSX.Element => {
  const listboxRef = useRef<HTMLDivElement>(null);
  const styleService = useStyleContext();
  const { app, model, interactions, embed } = useBaseContext();
  const { fontSize, fontFamily } = styleService.header;
  const { color, background, hoverBackground, activeBackground } = styleService.header.rowTitle;
  const anchorRef = useRef<HTMLDivElement>(null);
  const { shouldShowLockIcon, shouldShowMenuIcon } = columnWidthMetadata;
  const { open, setOpen, handleOpenMenu } = useHeadCellDim({ interactions });

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
  const searchRelatedArgs = { embed, listboxRef };
  const selectionRelatedArgs = { model: model as EngineAPI.IGenericObject, app };

  return (
    <StyledHeaderCellWrapper
      title={cell.title}
      interactions={interactions}
      background={open ? activeBackground : background}
      hoverBackground={hoverBackground}
      style={{
        ...style,
        ...getBorderStyle(true, isLastColumn, styleService.grid.border),
        padding: 0,
        position: "relative",
        display: "grid",
        gridTemplateColumns: shouldShowMenuIcon ? "1fr 24px" : "1fr",
        gridGap: shouldShowMenuIcon ? "4px" : "0px",
        alignItems: "center",
        cursor: interactions.active ? "pointer" : "default",
        color,
      }}
      data-testid={testId}
      onClick={handleOpenMenu}
    >
      <div style={{ ...labelWrapperStyle }}>
        {shouldShowLockIcon && cell.isLocked && (
          <div style={{ ...baseFlex, marginLeft: "8px" }}>
            <Locked height="12px" />
          </div>
        )}
        <div
          style={{
            ...labelTextStyle,
            fontSize,
            fontFamily,
            paddingLeft: shouldShowMenuIcon ? "8px" : "4px",
            paddingRight: shouldShowMenuIcon ? "0px" : "4px",
          }}
        >
          {cell.title}
        </div>
      </div>
      {isDim && (
        <>
          <HeadCellMenu
            headerData={headerData}
            translator={translator}
            tabIndex={-1}
            anchorRef={anchorRef}
            open={open}
            setOpen={setOpen}
            interactions={interactions}
            menuAvailabilityFlags={FLAGS}
            sortRelatedArgs={sortRelatedArgs}
            searchRelatedArgs={searchRelatedArgs}
            selectionRelatedArgs={selectionRelatedArgs}
            shouldShowMenuIcon={shouldShowMenuIcon}
          />
          <StyledHeaderAnchor ref={listboxRef} />
          <StyledHeaderAnchor ref={anchorRef} />
        </>
      )}
    </StyledHeaderCellWrapper>
  );
};

export default DimensionTitleCell;
