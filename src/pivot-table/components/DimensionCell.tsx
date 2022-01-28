import React from 'react';
import AddCircleOutlineSharpIcon from '@mui/icons-material/AddCircleOutlineSharp';
import RemoveCircleOutlineSharpIcon from '@mui/icons-material/RemoveCircleOutlineSharp';
import { Cell, ItemData, DataLoader } from '../../types/types';
import { NxPivotDimensionCell } from '../../types/QIX';
import { borderStyle, textStyle } from './shared-styles';

export interface DimensionCellProps {
  cell: Cell;
  rowIndex: number;
  colIndex: number;
  style: ReactWindow.ItemStyle;
  data: ItemData;
  isLeftColumn: boolean;
}

interface OnExpandOrCollapseProps {
  rowIndex: number;
  colIndex: number;
  isLeftColumn?: boolean;
  constraints: Stardust.Constraints;
  dataLoader: DataLoader;
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

const createOnExpand = ({ dataLoader, isLeftColumn, rowIndex, colIndex, constraints }: OnExpandOrCollapseProps) => {
  if (constraints.active) {
    return undefined;
  }

  return isLeftColumn
    ? () => dataLoader.expandLeft(rowIndex, colIndex)
    : () => dataLoader.expandTop(rowIndex, colIndex)
};

const createOnCollapse = ({ dataLoader, isLeftColumn, rowIndex, colIndex, constraints }: OnExpandOrCollapseProps) => {
  if (constraints.active) {
    return undefined;
  }

  return isLeftColumn
    ? () => dataLoader.collapseLeft(rowIndex, colIndex)
    : () => dataLoader.collapseTop(rowIndex, colIndex);
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
    constraints,
    dataLoader
  } = data;
  let onClickHandler: (() => void) | undefined;
  let cellIcon = null;

  if (qCanExpand) {
    cellIcon = <AddCircleOutlineSharpIcon fontSize="small" />
    onClickHandler = createOnExpand({ dataLoader, isLeftColumn, rowIndex, colIndex, constraints });
  } else if (qCanCollapse) {
    cellIcon = <RemoveCircleOutlineSharpIcon fontSize="small" />
    onClickHandler = createOnCollapse({ dataLoader, isLeftColumn, rowIndex, colIndex, constraints });
  }

  return (
    <div style={{ ...style, ...containerStyle}}>
      <div style={{ ...cellStyle, ...borderStyle }} onClick={onClickHandler} aria-hidden="true">
        {cellIcon}
        <div style={dimTextStyle}>{qText}</div>
      </div>
    </div>
  );
};

export default DimensionCell;
