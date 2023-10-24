import type { stardust } from "@nebula.js/stardust";
import React from "react";
import type { Cell, DataModel, ListItemData } from "../../../types/types";
import { useBaseContext } from "../../contexts/BaseProvider";
import { useSelectionsContext } from "../../contexts/SelectionsProvider";
import { useStyleContext } from "../../contexts/StyleProvider";
import MinusIcon from "../icons/Minus";
import PlusIcon from "../icons/Plus";
import ColumnAdjuster from "./ColumnAdjuster";
import { getContainerStyle, getInnerContainerStyle, getTextStyle } from "./utils/get-dimension-cell-style";
import shouldRenderColumnAdjuster from "./utils/should-render-column-adjuster";

export interface DimensionCellProps {
  cell: Cell;
  rowIndex: number;
  colIndex: number;
  style: React.CSSProperties;
  data: ListItemData;
  isLeftColumn: boolean;
  isLastRow: boolean;
  isLastColumn: boolean;
  showTotalCellDivider: boolean;
}

interface OnExpandOrCollapseProps {
  rowIndex: number;
  colIndex: number;
  isLeftColumn?: boolean;
  interactions: stardust.Interactions;
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
  interactions,
  isActive,
}: OnExpandOrCollapseProps) => {
  if (!interactions.active || isActive || !dataModel) {
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
  interactions,
  isActive,
}: OnExpandOrCollapseProps) => {
  if (!interactions.active || isActive || !dataModel) {
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
  showTotalCellDivider,
}: DimensionCellProps): JSX.Element => {
  const { qText, qCanCollapse, qCanExpand } = cell.ref;
  const { dataModel, layoutService, showLastBorder } = data;
  const styleService = useStyleContext();
  const { interactions } = useBaseContext();
  const { select, isSelected, isActive, isLocked } = useSelectionsContext();
  const isCellLocked = isLocked(cell) || cell.isLockedByDimension;
  const isNonSelectableCell =
    isCellLocked || cell.isEmpty || !interactions.active || !interactions.select || cell.isNull;
  const isCellSelected = isSelected(cell);
  const resolvedTextStyle = getTextStyle({
    isLeftColumn,
    styleService,
    qCanExpand,
    qCanCollapse,
    isCellSelected,
    isNull: cell.isNull,
    expressionColor: cell.expressionColor.color,
    isTotal: cell.isTotal,
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
    showLastBorder,
    showTotalCellDivider: !layoutService.showTotalsAbove && showTotalCellDivider,
    expressionBackground: cell.expressionColor.background,
    zIndex: layoutService.size.x - colIndex,
  });
  const onClickHandler = !isNonSelectableCell && select(cell);
  const text = cell.isNull ? layoutService.getNullValueText() : qText;
  let cellIcon = null;

  if (qCanExpand) {
    cellIcon = (
      <PlusIcon
        color={resolvedTextStyle.color as string}
        opacity={isActive ? 0.4 : 1.0}
        testid={testIdExpandIcon}
        onClick={createOnExpand({ dataModel, isLeftColumn, rowIndex: cell.y, colIndex, interactions, isActive })}
      />
    );
  } else if (qCanCollapse) {
    cellIcon = (
      <MinusIcon
        color={resolvedTextStyle.color as string}
        opacity={isActive ? 0.4 : 1.0}
        testid={testIdCollapseIcon}
        onClick={createOnCollapse({ dataModel, isLeftColumn, rowIndex: cell.y, colIndex, interactions, isActive })}
      />
    );
  }

  const columnAdjuster = shouldRenderColumnAdjuster(cell, isActive) ? (
    <ColumnAdjuster cell={cell} columnWidth={style.width as number} dataModel={dataModel} />
  ) : null;

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
      {columnAdjuster}
    </div>
  );
};

export default DimensionCell;
