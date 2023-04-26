import { stardust } from "@nebula.js/stardust";
import React from "react";
import NxDimCellType, { NxSelectionCellType } from "../../../types/QIX";
import { Cell, DataModel, ItemData } from "../../../types/types";
import { useSelectionsContext } from "../../contexts/SelectionsProvider";
import { useStyleContext } from "../../contexts/StyleProvider";
import MinusIcon from "../icons/Minus";
import PlusIcon from "../icons/Plus";
import { borderStyle, getLineClampStyle, textStyle } from "../shared-styles";

export interface DimensionCellProps {
  cell: Cell;
  rowIndex: number;
  colIndex: number;
  style: React.CSSProperties;
  data: ItemData;
  isLeftColumn: boolean;
}

interface OnExpandOrCollapseProps {
  rowIndex: number;
  colIndex: number;
  isLeftColumn?: boolean;
  constraints: stardust.Constraints;
  dataModel: DataModel | undefined;
  isActive: boolean;
}

const containerStyle: React.CSSProperties = {
  color: "#595959",
};

const cellStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
};

const stickyCell: React.CSSProperties = {
  width: "fit-content",
  maxWidth: "100%",
  position: "sticky",
  left: 4,
  top: 4,
};

const getDimTextStyle = (clampCount: number): React.CSSProperties => ({
  ...textStyle,
  fontWeight: "bold",
  marginLeft: 4,
  overflow: "hidden",
  textOverflow: "ellipsis",
  ...getLineClampStyle(clampCount),
});

const nullStyle: React.CSSProperties = {
  backgroundColor: "#f2f2f2",
};

export const selectedStyle: React.CSSProperties = {
  backgroundColor: "#0aaf54",
  color: "white",
};

export const lockedFromSelectionStyle: React.CSSProperties = {
  backgroundImage: "repeating-linear-gradient(-45deg, #f8f8f8, #f8f8f8 2px, transparent 2px, transparent 4px)",
  color: "#bebebe",
};

export const selectableCellStyle: React.CSSProperties = {
  cursor: "pointer",
};

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

const DimensionCell = ({ cell, rowIndex, colIndex, style, isLeftColumn, data }: DimensionCellProps): JSX.Element => {
  const { qText, qCanCollapse, qCanExpand, qType } = cell.ref;
  const { constraints = { active: false, passive: false, select: false }, dataModel, layoutService } = data;
  const styleService = useStyleContext();
  const { select, isSelected, isActive, isLocked } = useSelectionsContext();
  const isNull = qType === NxDimCellType.NX_DIM_CELL_NULL;
  const selectionCellType = isLeftColumn ? NxSelectionCellType.NX_CELL_LEFT : NxSelectionCellType.NX_CELL_TOP;
  const isCellLocked =
    isLocked(selectionCellType, rowIndex, colIndex) ||
    layoutService.isDimensionLocked(selectionCellType, rowIndex, colIndex);
  const appliedSelectedStyle = isSelected(selectionCellType, rowIndex, colIndex) ? selectedStyle : {};
  const appliedLockedSelectionStyle = isCellLocked ? lockedFromSelectionStyle : {};
  const isNonSelectableCell = isCellLocked || qType === NxDimCellType.NX_DIM_CELL_EMPTY || constraints.active || isNull;
  const appliedSelectableCellStyle = isNonSelectableCell ? {} : selectableCellStyle;
  const appliedNullStyle = isNull ? nullStyle : {};
  const onClickHandler = isNonSelectableCell ? undefined : select(selectionCellType, rowIndex, colIndex);
  const text = isNull ? layoutService.getNullValueText() : qText;
  const serviceStyle = isLeftColumn ? styleService.content : styleService.header;
  let cellIcon = null;

  if (qCanExpand) {
    cellIcon = (
      <PlusIcon
        color={serviceStyle.color}
        opacity={isActive ? 0.4 : 1.0}
        testid={testIdExpandIcon}
        onClick={createOnExpand({ dataModel, isLeftColumn, rowIndex, colIndex, constraints, isActive })}
      />
    );
  } else if (qCanCollapse) {
    cellIcon = (
      <MinusIcon
        color={serviceStyle.color}
        opacity={isActive ? 0.4 : 1.0}
        testid={testIdCollapseIcon}
        onClick={createOnCollapse({ dataModel, isLeftColumn, rowIndex, colIndex, constraints, isActive })}
      />
    );
  }

  return (
    <div
      title={text}
      style={{
        ...style,
        ...containerStyle,
        ...appliedSelectedStyle,
        ...appliedLockedSelectionStyle,
        ...appliedSelectableCellStyle,
        ...borderStyle,
        ...appliedNullStyle,
        display: "flex",
      }}
      aria-hidden="true"
      onClick={onClickHandler}
      onKeyUp={NOOP_KEY_HANDLER}
      role="button"
      tabIndex={0}
      data-testid={testId}
    >
      <div style={{ ...cellStyle, ...stickyCell, alignSelf: isLeftColumn ? "flex-start" : "flex-end" }}>
        {cellIcon}
        <span style={{ ...getDimTextStyle(styleService.lineClamp), ...serviceStyle }}>{text}</span>
      </div>
    </div>
  );
};

export default DimensionCell;
