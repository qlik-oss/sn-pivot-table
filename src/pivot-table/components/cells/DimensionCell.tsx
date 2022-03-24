import { stardust } from '@nebula.js/stardust';
import React from 'react';
import AddCircleOutlineSharpIcon from '@mui/icons-material/AddCircleOutlineSharp';
import RemoveCircleOutlineSharpIcon from '@mui/icons-material/RemoveCircleOutlineSharp';
import { CellValue, ItemData, DataModel } from '../../../types/types';
import { borderStyle, textStyle } from '../shared-styles';
import NxDimCellType, { NxSelectionCellType } from '../../../types/QIX';
import { useSelectionsContext } from '../../../contexts/SelectionsProvider';

export interface DimensionCellProps {
  cell: CellValue;
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
  color: '#595959',
};

const cellStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
};

const dimTextStyle: React.CSSProperties = {
  ...textStyle,
  fontWeight: 'bold',
  marginLeft: 4,
};

export const selectedStyle: React.CSSProperties = {
  backgroundColor: '#0aaf54',
  color: 'white'
};

export const lockedFromSelectionStyle: React.CSSProperties = {
  backgroundImage: 'repeating-linear-gradient(-45deg, #f8f8f8, #f8f8f8 2px, transparent 2px, transparent 4px)',
  color: '#bebebe'
};

export const selectableCellStyle: React.CSSProperties = {
  cursor: 'pointer'
};

export const testId = 'dim-cell';
export const testIdExpandIcon = 'expand-icon';
export const testIdCollapseIcon = 'collapse-icon';

const NOOP_KEY_HANDLER = () => {};

const createOnExpand = ({ dataModel, isLeftColumn, rowIndex, colIndex, constraints, isActive }: OnExpandOrCollapseProps) => {
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

const createOnCollapse = ({ dataModel, isLeftColumn, rowIndex, colIndex, constraints, isActive }: OnExpandOrCollapseProps) => {
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
  data
}: DimensionCellProps): JSX.Element => {
  const { qText, qCanCollapse, qCanExpand, qType } = cell as EngineAPI.INxPivotDimensionCell;
  const {
    constraints = { active: false, passive: false, select: false },
    dataModel,
  } = data;
  const { select, isSelected, isActive, isLocked } = useSelectionsContext();
  const selectionCellType = isLeftColumn ? NxSelectionCellType.NX_CELL_LEFT : NxSelectionCellType.NX_CELL_TOP;
  const isCellLocked = isLocked(selectionCellType, rowIndex, colIndex) || dataModel?.isDimensionLocked(selectionCellType, rowIndex, colIndex);
  const appliedSelectedStyle = isSelected(selectionCellType, rowIndex, colIndex) ? selectedStyle : {};
  const appliedLockedSelectionStyle = isCellLocked ? lockedFromSelectionStyle : {};
  const isNonSelectableCell = isCellLocked || qType === NxDimCellType.NX_DIM_CELL_EMPTY || constraints.active;
  const appliedSelectableCellStyle = isNonSelectableCell ? {} : selectableCellStyle;
  const onClickHandler = isNonSelectableCell ? undefined : select(selectionCellType, rowIndex, colIndex);
  let cellIcon = null;

  if (qCanExpand) {
    cellIcon = <AddCircleOutlineSharpIcon
      fontSize="small"
      data-testid={testIdExpandIcon}
      onClick={createOnExpand({ dataModel, isLeftColumn, rowIndex, colIndex, constraints, isActive })}
      color={isActive ? 'disabled' : 'action'}
    />;
  } else if (qCanCollapse) {
    cellIcon = <RemoveCircleOutlineSharpIcon
      fontSize="small"
      data-testid={testIdCollapseIcon}
      onClick={createOnCollapse({ dataModel, isLeftColumn, rowIndex, colIndex, constraints, isActive })}
      color={isActive ? 'disabled' : 'action'}
    />;
  }

  return (
    <div
      style={{
        ...style,
        ...containerStyle,
        ...appliedSelectedStyle,
        ...appliedLockedSelectionStyle,
        ...appliedSelectableCellStyle,
        ...borderStyle
      }}
      aria-hidden="true"
      onClick={onClickHandler}
      onKeyUp={NOOP_KEY_HANDLER}
      role="button"
      tabIndex={0}
      data-testid={testId}
    >
      <div style={{ ...cellStyle }} >
        {cellIcon}
        <div style={dimTextStyle}>{qText}</div>
      </div>
    </div>
  );
};

export default DimensionCell;
