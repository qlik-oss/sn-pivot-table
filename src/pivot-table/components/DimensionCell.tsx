import React from 'react';
import { Model } from '../../types/types';
import { NxPivotDimensionCell } from '../../types/QIX';
import { Cell } from '../handle-data';
import { borderStyle, textStyle } from './shared-styles';

export interface DimensionCellProps {
  cell: Cell;
  model: Model;
  rowIndex: number;
  colIndex: number;
  isLeftColumn?: boolean;
  style: any;
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

const DimensionCell = ({ model, cell, isLeftColumn = false, rowIndex = 0, colIndex = 0, style }: DimensionCellProps): JSX.Element => {
  const { qText, qCanCollapse, qCanExpand } = (cell.value as NxPivotDimensionCell);
  let cellContent = qText;
  let onPress;

  if (qCanExpand) {
    cellContent = `[ + ] ${qText}`;
    onPress = isLeftColumn
      ? () => model.expandLeft(PATH, rowIndex, colIndex, false)
      : () => model.expandTop(PATH, rowIndex, colIndex, false);
  } else if (qCanCollapse) {
    cellContent = `[ - ] ${qText}`;
    onPress = isLeftColumn
      ? () => model.collapseLeft(PATH, rowIndex, colIndex, false)
      : () => model.collapseTop(PATH, rowIndex, colIndex, false);
  }

  return (
    <div style={{ ...style, ...containerStyle}}>
      <div style={{ ...cellStyle, ...borderStyle }} onClick={onPress} aria-hidden="true">
        <div style={dimTextStyle}>
            {cellContent}
        </div>
      </div>
    </div>
  );
};

export default DimensionCell;
