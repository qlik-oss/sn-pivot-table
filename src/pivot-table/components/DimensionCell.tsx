import { stardust } from '@nebula.js/stardust';
import React from 'react';
import AddCircleOutlineSharpIcon from '@mui/icons-material/AddCircleOutlineSharp';
import RemoveCircleOutlineSharpIcon from '@mui/icons-material/RemoveCircleOutlineSharp';
import { CellValue, ItemData, DataModel } from '../../types/types';
import { borderStyle, textStyle } from './shared-styles';
import { NxSelectionCellType } from '../../types/QIX';
import { useSelectionsContext } from '../../contexts/SelectionsProvider';

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
  dataModel: DataModel;
  isActive: boolean;
}

const containerStyle: React.CSSProperties = {
  color: 'rgb(89, 89, 89)',
};

const cellStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  height: '100%'
};

const dimTextStyle: React.CSSProperties = {
  ...textStyle,
  fontWeight: 'bold',
  marginLeft: 4,
};

const selectedStyle: React.CSSProperties = {
  backgroundColor: 'rgb(0, 152, 69)',
  color: 'white'
};

export const testId = 'dim-cell';
export const testIdExpandIcon = 'expand-icon';
export const testIdCollapseIcon = 'collapse-icon';

const createOnExpand = ({ dataModel, isLeftColumn, rowIndex, colIndex, constraints, isActive }: OnExpandOrCollapseProps) => {
  if (constraints.active || isActive) {
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
  if (constraints.active || isActive) {
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
  const { qText, qCanCollapse, qCanExpand } = cell as EngineAPI.INxPivotDimensionCell;
  const {
    constraints = { active: false, passive: false, select: false },
    dataModel,
  } = data;
  const { select, isSelected, isActive } = useSelectionsContext();
  const selectionCellType = isLeftColumn ? NxSelectionCellType.NX_CELL_LEFT : NxSelectionCellType.NX_CELL_TOP;
  const appliedSelectionStyle = isSelected(selectionCellType, rowIndex, colIndex) ? selectedStyle : {};
  let cellIcon = null;

  if (qCanExpand) {
    cellIcon = <AddCircleOutlineSharpIcon
      fontSize="small"
      data-testid={testIdExpandIcon}
      onClick={createOnExpand({ dataModel, isLeftColumn, rowIndex, colIndex, constraints, isActive })}
      color={isActive ? 'disabled' : undefined}
    />;
  } else if (qCanCollapse) {
    cellIcon = <RemoveCircleOutlineSharpIcon
      fontSize="small"
      data-testid={testIdCollapseIcon}
      onClick={createOnCollapse({ dataModel, isLeftColumn, rowIndex, colIndex, constraints, isActive })}
      color={isActive ? 'disabled' : undefined}
    />;
  }

  return (
    <div style={{ ...style, ...containerStyle, ...appliedSelectionStyle}} data-testid={testId}>
      <div
        style={{ ...cellStyle, ...borderStyle }}
        aria-hidden="true"
        onClick={select(selectionCellType, rowIndex, colIndex)}
        onKeyUp={() => {}}
        role="button"
        tabIndex={0}
      >
        {cellIcon}
        <div style={dimTextStyle}>{qText}</div>
      </div>
    </div>
  );
};

export default DimensionCell;
