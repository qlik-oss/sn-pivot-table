import React from 'react';
import AddCircleOutlineSharpIcon from '@mui/icons-material/AddCircleOutlineSharp';
import RemoveCircleOutlineSharpIcon from '@mui/icons-material/RemoveCircleOutlineSharp';
import { Cell, ItemData, DataModel } from '../../types/types';
import { NxPivotDimensionCell } from '../../types/QIX';
import { borderStyle, textStyle } from './shared-styles';

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
  constraints: Stardust.Constraints;
  dataModel: DataModel;
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

export const testId = 'dim-cell';
export const testIdExpandIcon = 'expand-icon';
export const testIdCollapseIcon = 'collapse-icon';

const createOnExpand = ({ dataModel, isLeftColumn, rowIndex, colIndex, constraints }: OnExpandOrCollapseProps) => {
  if (constraints.active) {
    return undefined;
  }

  return isLeftColumn
    ? () => dataModel.expandLeft(rowIndex, colIndex)
    : () => dataModel.expandTop(rowIndex, colIndex)
};

const createOnCollapse = ({ dataModel, isLeftColumn, rowIndex, colIndex, constraints }: OnExpandOrCollapseProps) => {
  if (constraints.active) {
    return undefined;
  }

  return isLeftColumn
    ? () => dataModel.collapseLeft(rowIndex, colIndex)
    : () => dataModel.collapseTop(rowIndex, colIndex);
};

const DimensionCell = ({
  cell,
  rowIndex = 0,
  colIndex = 0,
  style,
  isLeftColumn = false,
  data
}: DimensionCellProps): JSX.Element => {
  const { qText, qCanCollapse, qCanExpand } = (cell.value as NxPivotDimensionCell);
  const {
    constraints = { active: false, passive: false, select: false },
    dataModel
  } = data;
  let onClickHandler: (() => void) | undefined;
  let cellIcon = null;

  if (qCanExpand) {
    cellIcon = <AddCircleOutlineSharpIcon fontSize="small" data-testid={testIdExpandIcon} />
    onClickHandler = createOnExpand({ dataModel, isLeftColumn, rowIndex, colIndex, constraints });
  } else if (qCanCollapse) {
    cellIcon = <RemoveCircleOutlineSharpIcon fontSize="small" data-testid={testIdCollapseIcon} />
    onClickHandler = createOnCollapse({ dataModel, isLeftColumn, rowIndex, colIndex, constraints });
  }

  return (
    <div style={{ ...style, ...containerStyle}} data-testid={testId}>
      <div style={{ ...cellStyle, ...borderStyle }} onClick={onClickHandler} aria-hidden="true">
        {cellIcon}
        <div style={dimTextStyle}>{qText}</div>
      </div>
    </div>
  );
};

export default DimensionCell;
