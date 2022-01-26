import React from 'react';
import { Model, Cell } from '../../types/types';
import { NxPivotDimensionCell } from '../../types/QIX';
import { borderStyle, textStyle } from './shared-styles';

export interface DimensionCellProps {
  cell: Cell;
  model: Model;
  rowIndex: number;
  colIndex: number;
  isLeftColumn?: boolean;
  style: ReactWindow.ItemStyle;
  constraints: Stardust.Constraints;
}

interface OnExpandCollapseProps {
  model: Model;
  rowIndex: number;
  colIndex: number;
  isLeftColumn?: boolean;
  constraints: Stardust.Constraints;
}

const PATH = '/qHyperCubeDef';

const containerStyle: React.CSSProperties = {
  color: 'rgb(89, 89, 89)',
};
const cellStyle: React.CSSProperties = {
  justifyContent: 'center',
  height: '100%'
};
const dimTextStyle: React.CSSProperties = {
  ...textStyle,
  fontWeight: 'bold',
};

const createOnExpand = ({ model, isLeftColumn, rowIndex, colIndex, constraints }: OnExpandCollapseProps) => {
  if (constraints.active) {
    return undefined;
  }

  return isLeftColumn
    ? () => model.expandLeft(PATH, rowIndex, colIndex, false)
    : () => model.expandTop(PATH, rowIndex, colIndex, false);
};

const createOnCollapse = ({ model, isLeftColumn, rowIndex, colIndex, constraints }: OnExpandCollapseProps) => {
  if (constraints.active) {
    return undefined;
  }

  return isLeftColumn
    ? () => model.collapseLeft(PATH, rowIndex, colIndex, false)
    : () => model.collapseTop(PATH, rowIndex, colIndex, false);
};

const DimensionCell = ({
  model,
  cell,
  isLeftColumn = false,
  rowIndex = 0,
  colIndex = 0,
  style,
  constraints
}: DimensionCellProps): JSX.Element => {
  const { qText, qCanCollapse, qCanExpand } = (cell.value as NxPivotDimensionCell);
  let cellContent = qText;
  let onClickHandler: (() => void) | undefined;

  if (qCanExpand) {
    cellContent = `[ + ] ${qText}`;
    onClickHandler = createOnExpand({ model, isLeftColumn, rowIndex, colIndex, constraints });
  } else if (qCanCollapse) {
    cellContent = `[ - ] ${qText}`;
    onClickHandler = createOnCollapse({ model, isLeftColumn, rowIndex, colIndex, constraints });
  }

  return (
    <div style={{ ...style, ...containerStyle}}>
      <div style={{ ...cellStyle, ...borderStyle }} onClick={onClickHandler} aria-hidden="true">
        <div style={dimTextStyle}>
            {cellContent}
        </div>
      </div>
    </div>
  );
};

export default DimensionCell;
