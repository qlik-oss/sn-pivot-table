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
import { HEADER_ICON_SIZE } from "../../constants";
import { useBaseContext } from "../../contexts/BaseProvider";
import { useStyleContext } from "../../contexts/StyleProvider";
import type { GetHeaderCellsIconsVisibilityStatus } from "../../hooks/use-column-width";
import { useHeadCellDim } from "../../hooks/use-head-cell-dim";
import { getBorderStyle } from "../shared-styles";
import { StyledHeaderAnchor, StyledHeaderCell, StyledHeaderCellWrapper, StyledLabel, StyledLockIcon } from "./styles";

interface DimensionTitleCellProps {
  cell: HeaderCell;
  style: React.CSSProperties;
  isLastColumn: boolean;
  translator: stardust.Translator;
  changeSortOrder: ChangeSortOrder;
  changeActivelySortedHeader: ChangeActivelySortedHeader;
  iconsVisibilityStatus: ReturnType<GetHeaderCellsIconsVisibilityStatus>;
}

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
  iconsVisibilityStatus,
}: DimensionTitleCellProps): JSX.Element => {
  const listboxRef = useRef<HTMLDivElement>(null);
  const styleService = useStyleContext();
  const { app, model, interactions, embed } = useBaseContext();
  const { fontSize, fontFamily } = styleService.header;
  const { color, background, hoverBackground, activeBackground } = styleService.header.rowTitle;
  const anchorRef = useRef<HTMLDivElement>(null);
  const { shouldShowLockIcon, shouldShowMenuIcon } = iconsVisibilityStatus;
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
      shouldShowMenuIcon={shouldShowMenuIcon}
      style={{
        ...style,
        ...getBorderStyle(true, isLastColumn, styleService.grid.border),
        color,
      }}
      data-testid={testId}
      onClick={handleOpenMenu}
    >
      <StyledHeaderCell>
        {shouldShowLockIcon && (
          <StyledLockIcon>
            <Locked height={HEADER_ICON_SIZE} />
          </StyledLockIcon>
        )}
        <StyledLabel {...{ fontFamily, fontSize }}>{cell.title}</StyledLabel>
      </StyledHeaderCell>
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
