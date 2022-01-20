import React from 'react';
import { Model } from '../../types/types';
import { NxPivotDimensionCell } from '../../types/QIX';
import { Cell } from '../handle-data';

export interface DimensionCellProps {
  cell: Cell;
  model: Model;
  rowIndex: number;
  colIndex: number;
  isLeftColumn?: boolean;
  style: any;
}

const PATH = '/qHyperCubeDef';

const DimensionCell = ({ model, cell, isLeftColumn = false, rowIndex = 0, colIndex = 0, style }: DimensionCellProps): JSX.Element => {
  const containerStyle = {
    color: 'rgb(89, 89, 89)',
  };
  const cellStyle = {
    boxSizing: 'border-box',
    borderLeftWidth: 1,
    borderBottomWidth: 1,
    borderRightWidth: 0,
    borderTopWidth: 0,
    borderColor: 'rgb(230, 230, 230)',
    padding: 4,
    justifyContent: 'center',
    borderStyle: 'solid',
  };
  const textStyle = {
    fontFamily: '"Source Sans Pro", sans-serif',
    fontSize: 13,
    fontWeight: '700',
  };
  const { qText, qCanCollapse, qCanExpand } = (cell.value as NxPivotDimensionCell);
  let cellContent = qText;
  let onPress;

  if (qCanExpand) {
    cellContent = `[ + ] ${qText}`;
    onPress = isLeftColumn
      ? () => console.log('rowIdx', rowIndex, 'colIdx', colIndex) || model.expandLeft(PATH, rowIndex, colIndex, false)
      : () => model.expandTop(PATH, rowIndex, colIndex, false);
  } else if (qCanCollapse) {
    cellContent = `[ - ] ${qText}`;
    onPress = isLeftColumn
      ? () => model.collapseLeft(PATH, rowIndex, colIndex, false)
      : () => model.collapseTop(PATH, rowIndex, colIndex, false);
  }

  return (
    <div style={containerStyle}>
      <div style={{ ...cellStyle, ...style }} onClick={onPress} aria-hidden="true">
        <span style={{ padding: '4px', ...textStyle }}>
            {cellContent}
        </span>
      </div>
    </div>
  );
};

export default DimensionCell;
