import React, { type ReactNode } from "react";
import { NxSelectionCellType } from "../../../../types/QIX";
import type { Cell, ListItemData } from "../../../../types/types";
import { useBaseContext } from "../../../contexts/BaseProvider";
import { useSelectionsContext } from "../../../contexts/SelectionsProvider";
import { useStyleContext } from "../../../contexts/StyleProvider";
import { getBorderStyle, getTotalCellDividerStyle } from "../../shared-styles";
import { getBackground, getCursor } from "../utils/get-dimension-value-cell-style";

type Props = {
  text: string;
  reactWindowStyle: React.CSSProperties;
  isLeftColumn: boolean;
  isLastRow: boolean;
  isLastColumn: boolean;
  showTotalCellDivider: boolean;
  cell: Cell;
  data: ListItemData;
  children: ReactNode;
};

export const testId = "dim-cell";

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
}: Props): JSX.Element => {
  const styleService = useStyleContext();
  const { interactions } = useBaseContext();
  const { select, isSelected, isLocked } = useSelectionsContext();
  const { layoutService, showLastBorder } = data;

  const selectionCellType = isLeftColumn ? NxSelectionCellType.NX_CELL_LEFT : NxSelectionCellType.NX_CELL_TOP;
  const isCellLocked = cell ? isLocked(selectionCellType, cell.y, cell.x) || cell.isLockedByDimension : false;
  const isNonSelectableCell =
    cell === undefined ||
    isCellLocked ||
    !interactions.active ||
    !interactions.select ||
    cell.isEmpty ||
    cell.isNull ||
    cell.isPseudoDimension ||
    cell.isTotal;
  const isCellSelected = cell ? isSelected(selectionCellType, cell.y, cell.x) : false;
  const onClickHandler = isNonSelectableCell ? undefined : select(selectionCellType, cell.y, cell.x);

  return (
    <div
      title={text}
      style={{
        ...reactWindowStyle,
        ...getBorderStyle(isLastRow, isLastColumn, styleService.grid.border, showLastBorder),
        ...getTotalCellDividerStyle({
          bottomDivider: showTotalCellDivider && isLeftColumn,
          rightDivider: showTotalCellDivider && !isLeftColumn,
          borderColor: styleService.grid.divider,
        }),
        ...(!isLeftColumn && { justifyContent: "center" }),
        cursor: getCursor(isNonSelectableCell),
        background: getBackground({ styleService, isCellLocked, isCellSelected, cell }),
        zIndex: layoutService.size.x - cell.x,
        display: "flex",
      }}
      aria-hidden="true"
      onClick={onClickHandler}
      onKeyUp={NOOP_KEY_HANDLER}
      role="button"
      tabIndex={0}
      data-testid={testId}
      data-row-idx={cell.y}
      data-column-idx={cell.x}
      data-cell-type={cell.ref.qType}
    >
      {children}
    </div>
  );
};

export default Container;