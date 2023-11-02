/* eslint jsx-a11y/click-events-have-key-events: 0, jsx-a11y/no-static-element-interactions: 0 */
import type { stardust } from "@nebula.js/stardust";
import Locked from "@qlik-trial/sprout/icons/react/Lock";
import HeadCellMenu, { MenuAvailabilityFlags } from "@qlik/nebula-table-utils/lib/components/HeadCellMenu";
import type { SortDirection, SortingRelatedArgs } from "@qlik/nebula-table-utils/lib/components/HeadCellMenu/types";
import React, { useRef } from "react";
import type { ChangeActivelySortedHeader, ChangeSortOrder, DataModel, HeaderCell } from "../../../types/types";
import { HEADER_ICON_SIZE } from "../../constants";
import { useBaseContext } from "../../contexts/BaseProvider";
import { useStyleContext } from "../../contexts/StyleProvider";
import type { GetHeaderCellsIconsVisibilityStatus, OverrideLeftGridWidth } from "../../hooks/use-column-width";
import { useHeadCellDim } from "../../hooks/use-head-cell-dim";
import { getBorderStyle } from "../shared-styles";
import ColumnAdjuster from "./ColumnAdjuster";
import { StyledHeaderAnchor, StyledHeaderCell, StyledHeaderCellWrapper, StyledLabel, StyledLockIcon } from "./styles";

interface DimensionTitleCellProps {
  dataModel: DataModel;
  cell: HeaderCell;
  style: React.CSSProperties;
  isLastColumn: boolean;
  translator: stardust.Translator;
  changeSortOrder: ChangeSortOrder;
  changeActivelySortedHeader: ChangeActivelySortedHeader;
  iconsVisibilityStatus: ReturnType<GetHeaderCellsIconsVisibilityStatus>;
  columnWidth: number;
  overrideLeftGridWidth: OverrideLeftGridWidth;
}

export const testId = "title-cell";

const FLAGS = {
  [MenuAvailabilityFlags.SORTING]: true,
  [MenuAvailabilityFlags.SELECTIONS]: true,
  [MenuAvailabilityFlags.SEARCHING]: true,
};

const DimensionTitleCell = ({
  dataModel,
  cell,
  style,
  isLastColumn,
  translator,
  changeSortOrder,
  changeActivelySortedHeader,
  iconsVisibilityStatus,
  columnWidth,
  overrideLeftGridWidth,
}: DimensionTitleCellProps): JSX.Element => {
  const listboxRef = useRef<HTMLDivElement>(null);
  const styleService = useStyleContext();
  const { app, model, interactions, embed } = useBaseContext();
  const {
    fontSize,
    fontFamily,
    fontStyle,
    fontWeight,
    textDecoration,
    color,
    background,
    hoverBackground,
    activeBackground,
  } = styleService.header;
  const anchorRef = useRef<HTMLDivElement>(null);
  const { shouldShowLockIcon, shouldShowMenuIcon } = iconsVisibilityStatus;
  const { open, setOpen, handleOpenMenu } = useHeadCellDim({ interactions });

  const sortFromMenu = async (evt: React.MouseEvent, newSortDirection: SortDirection) => {
    evt.stopPropagation();
    await changeSortOrder(cell, newSortDirection);
  };

  const sortRelatedArgs: SortingRelatedArgs = { sortFromMenu, changeActivelySortedHeader };
  const searchRelatedArgs = { embed, listboxRef };
  const selectionRelatedArgs = { model: model as EngineAPI.IGenericObject, app };

  return (
    <StyledHeaderCellWrapper
      title={cell.label}
      interactions={interactions}
      background={open ? activeBackground : background}
      hoverBackground={hoverBackground}
      shouldShowMenuIcon={shouldShowMenuIcon}
      isDimension={cell.isDim}
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
        <StyledLabel {...{ fontFamily, fontSize, fontStyle, fontWeight, textDecoration }}>{cell.label}</StyledLabel>
      </StyledHeaderCell>
      {cell.isDim && (
        <>
          <HeadCellMenu
            headerData={cell}
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
      <ColumnAdjuster
        cellInfo={{ ...cell, isLeftColumn: true }}
        columnWidth={columnWidth}
        dataModel={dataModel}
        isLastColumn={isLastColumn}
        overrideLeftGridWidth={overrideLeftGridWidth}
      />
    </StyledHeaderCellWrapper>
  );
};

export default DimensionTitleCell;
