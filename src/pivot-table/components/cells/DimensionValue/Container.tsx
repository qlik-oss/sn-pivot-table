import React, { type ReactNode } from "react";
import type { Cell, ListItemData } from "../../../../types/types";
import { useBaseContext } from "../../../contexts/BaseProvider";
import { useSelectionsContext } from "../../../contexts/SelectionsProvider";
import { useStyleContext } from "../../../contexts/StyleProvider";
import { getBorderStyle, getTotalCellDividerStyle } from "../../shared-styles";
import { getBackground, getCursor } from "./utils/get-style";

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

  const isCellLocked = cell ? isLocked(cell) || cell.isLockedByDimension : false;
  const isNonSelectableCell =
    cell === undefined ||
    isCellLocked ||
    !interactions.active ||
    !interactions.select ||
    cell.isEmpty ||
    cell.isNull ||
    cell.isPseudoDimension ||
    cell.isTotal;
  const isCellSelected = cell ? isSelected(cell) : false;
  const onClickHandler = isNonSelectableCell ? undefined : select(cell);

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
        cursor: getCursor(isNonSelectableCell),
        background: getBackground({ styleService, isCellLocked, isCellSelected, cell }),
        zIndex: layoutService.size.x - cell.x,
        justifyContent: isLeftColumn ? undefined : "center",
        display: "flex",
      }}
      aria-hidden="true"
      onClick={onClickHandler}
      onKeyUp={NOOP_KEY_HANDLER}
      role="button"
      tabIndex={0}
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
