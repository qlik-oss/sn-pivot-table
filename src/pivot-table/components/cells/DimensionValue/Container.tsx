import React, { type ReactNode } from "react";
import type { Cell, ListItemData } from "../../../../types/types";
import { useBaseContext } from "../../../contexts/BaseProvider";
import { useSelectionsContext } from "../../../contexts/SelectionsProvider";
import { useStyleContext } from "../../../contexts/StyleProvider";
import { CELL_PADDING, baseCellStyle, getBorderStyle, getTotalCellDividerStyle } from "../../shared-styles";
import { getBackground, getCursor } from "./utils/get-style";
import getTextAlign from "./utils/get-text-align";

type Props = {
  text: string;
  reactWindowStyle: React.CSSProperties;
  isLeftColumn: boolean;
  isLastRow: boolean;
  isLastColumn: boolean;
  isCellSelected: boolean;
  showTotalCellDivider: boolean;
  cell: Cell;
  data: ListItemData;
  children: ReactNode;
  isAdjustingWidth: boolean;
};

export const testId = "dimension-cell";

const NOOP_KEY_HANDLER = () => {};

const Container = ({
  children,
  text,
  reactWindowStyle,
  cell,
  data,
  showTotalCellDivider,
  isLastRow,
  isLastColumn,
  isLeftColumn,
  isCellSelected,
  isAdjustingWidth,
}: Props): JSX.Element => {
  const styleService = useStyleContext();
  const { interactions, flags } = useBaseContext();
  const { select, isLocked } = useSelectionsContext();
  const { layoutService, showLastBorder } = data;

  const isCellLocked = isLocked(cell) || cell.isLockedByDimension;
  const canBeSelected =
    !isCellLocked &&
    !!interactions.active &&
    !!interactions.select &&
    !cell.isEmpty &&
    !cell.isNull &&
    !cell.isPseudoDimension &&
    !cell.isTotal &&
    !isAdjustingWidth;
  const onClickHandler = canBeSelected ? select(cell) : undefined;

  return (
    <div
      title={interactions.passive ? text : undefined}
      style={{
        ...reactWindowStyle,
        ...getBorderStyle(isLastRow, isLastColumn, styleService.grid.border, showLastBorder),
        ...getTotalCellDividerStyle({
          bottomDivider: showTotalCellDivider && isLeftColumn,
          rightDivider: showTotalCellDivider && !isLeftColumn,
          borderColor: styleService.grid.divider,
        }),
        ...baseCellStyle,
        padding: `0px ${CELL_PADDING}px`,
        cursor: getCursor(canBeSelected),
        background: getBackground({ styleService, isCellSelected, cell, isCellLocked }),
        zIndex: isLeftColumn ? undefined : layoutService.size.x - cell.x,
        justifyContent: getTextAlign(cell, layoutService, isLeftColumn, flags),
        display: "flex",
      }}
      aria-hidden="true"
      onClick={onClickHandler}
      onKeyUp={NOOP_KEY_HANDLER}
      role="button"
      tabIndex={-1}
      data-testid={testId}
      data-x={cell.x}
      data-page-x={cell.pageX}
      data-y={cell.y}
      data-page-y={cell.pageY}
      data-cell-type={cell.ref.qType}
    >
      {children}
    </div>
  );
};

export default Container;
