import type { stardust } from "@nebula.js/stardust";
import React from "react";
import { NxSelectionCellType } from "../../../types/QIX";
import type { Cell, DataModel, ListItemData } from "../../../types/types";
import { useSelectionsContext } from "../../contexts/SelectionsProvider";
import { useStyleContext } from "../../contexts/StyleProvider";
import { shouldShowTotalCellDivider } from "../../hooks/use-is-total-cell";
import MinusIcon from "../icons/Minus";
import PlusIcon from "../icons/Plus";
import { getContainerStyle, getInnerContainerStyle, getTextStyle } from "./utils/get-dimension-cell-style";

export interface DimensionCellProps {
  cell: Cell;
  rowIndex: number;
  colIndex: number;
  style: React.CSSProperties;
  data: ListItemData;
  isLeftColumn: boolean;
  isLastRow: boolean;
  isLastColumn: boolean;
}

interface OnExpandOrCollapseProps {
  rowIndex: number;
  colIndex: number;
  isLeftColumn?: boolean;
  constraints: stardust.Constraints;
  dataModel: DataModel | undefined;
  isActive: boolean;
}

export const testId = "dim-cell";
export const testIdExpandIcon = "expand-icon";
export const testIdCollapseIcon = "collapse-icon";

const NOOP_KEY_HANDLER = () => {};

const createOnExpand = ({
  dataModel,
  isLeftColumn,
  rowIndex,
  colIndex,
  constraints,
  isActive,
}: OnExpandOrCollapseProps) => {
  if (constraints.active || isActive || !dataModel) {
    return undefined;
  }

  const action = isLeftColumn
    ? () => dataModel.expandLeft(rowIndex, colIndex)
    : () => dataModel.expandTop(rowIndex, colIndex);

  return (e: React.SyntheticEvent) => {
    action();
    e.stopPropagation();
  };
};

const createOnCollapse = ({
  dataModel,
  isLeftColumn,
  rowIndex,
  colIndex,
  constraints,
  isActive,
}: OnExpandOrCollapseProps) => {
  if (constraints.active || isActive || !dataModel) {
    return undefined;
  }

  const action = isLeftColumn
    ? () => dataModel.collapseLeft(rowIndex, colIndex)
    : () => dataModel.collapseTop(rowIndex, colIndex);

  return (e: React.SyntheticEvent) => {
    action();
    e.stopPropagation();
  };
};

const DimensionCell = ({
  cell,
  rowIndex,
  colIndex,
  style,
  isLeftColumn,
  data,
  isLastRow,
  isLastColumn,
}: DimensionCellProps): JSX.Element => {
  const { qText, qCanCollapse, qCanExpand } = cell.ref;
  const {
    constraints = { active: false, passive: false, select: false },
    dataModel,
    layoutService,
    showLastRowBorderBottom,
    list,
  } = data;
  const nextSibling = isLeftColumn ? list[cell.pageY + 1] : list[cell.pageX + 1];
  const styleService = useStyleContext();
  const { select, isSelected, isActive, isLocked } = useSelectionsContext();
  const selectionCellType = isLeftColumn ? NxSelectionCellType.NX_CELL_LEFT : NxSelectionCellType.NX_CELL_TOP;
  const isCellLocked = isLocked(selectionCellType, cell.y, colIndex) || cell.isLockedByDimension;
  const isNonSelectableCell = isCellLocked || cell.isEmpty || constraints.active || cell.isNull;
  const isCellSelected = isSelected(selectionCellType, cell.y, colIndex);
  const resolvedTextStyle = getTextStyle({
    isLeftColumn,
    styleService,
    qCanExpand,
    qCanCollapse,
    isCellSelected,
    isNull: cell.isNull,
  });
  const resolvedInnerContainerStyle = getInnerContainerStyle(isLeftColumn);
  const resolvedContainerStyle = getContainerStyle({
    style,
    isCellLocked,
    isNull: cell.isNull,
    isLastColumn,
    isLastRow,
    isNonSelectableCell,
    isCellSelected,
    styleService,
    isLeftColumn,
    showLastRowBorderBottom,
    showTotalCellDivider: !layoutService.showTotalsAbove && shouldShowTotalCellDivider(nextSibling),
  });
  const onClickHandler = isNonSelectableCell ? undefined : select(selectionCellType, cell.y, colIndex);
  const text = cell.isNull ? layoutService.getNullValueText() : qText;
  const serviceStyle = isLeftColumn ? styleService.rowContent : styleService.columnContent;
  let cellIcon = null;

  if (qCanExpand) {
    cellIcon = (
      <PlusIcon
        color={cell.isNull ? serviceStyle.nullValue.color : serviceStyle.color}
        opacity={isActive ? 0.4 : 1.0}
        testid={testIdExpandIcon}
        onClick={createOnExpand({ dataModel, isLeftColumn, rowIndex: cell.y, colIndex, constraints, isActive })}
      />
    );
  } else if (qCanCollapse) {
    cellIcon = (
      <MinusIcon
        color={cell.isNull ? serviceStyle.nullValue.color : serviceStyle.color}
        opacity={isActive ? 0.4 : 1.0}
        testid={testIdCollapseIcon}
        onClick={createOnCollapse({ dataModel, isLeftColumn, rowIndex: cell.y, colIndex, constraints, isActive })}
      />
    );
  }

  return (
    <div
      title={text}
      style={resolvedContainerStyle}
      aria-hidden="true"
      onClick={onClickHandler}
      onKeyUp={NOOP_KEY_HANDLER}
      role="button"
      tabIndex={0}
      data-testid={testId}
      data-row-idx={rowIndex}
      data-column-idx={colIndex}
    >
      <div style={resolvedInnerContainerStyle}>
        {cellIcon}
        <span style={resolvedTextStyle}>{text}</span>
      </div>
    </div>
  );
};

export default DimensionCell;
