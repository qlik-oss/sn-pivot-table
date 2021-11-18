import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Model } from '../../types/types';
import { Cell, TYPE } from '../handle-data';
import DimensionCell from './DimensionCell';
import MeasureCell from './MeasureCell';
import sharedStyles from './shared-styles';

export interface CellValueProps {
  cell: Cell;
  rowIndex: number;
  colIndex: number;
  model: Model;
  isLeftColumn: boolean;
}

const borderColor = 'rgb(230, 230, 230)';
const minHeight = 24;

const styles = StyleSheet.create({
  cell: {
    color: 'rgb(89, 89, 89)',
    borderLeftWidth: 1,
    borderBottomWidth: 1,
    borderColor,
    paddingLeft: 4,
    paddingRight: 4,
    minHeight,
    justifyContent: 'center',
  },
  label: {
    fontWeight: 500,
    color: 'rgb(89, 89, 89)',
    borderLeftWidth: 1,
    borderBottomWidth: 1,
    borderColor,
    paddingLeft: 4,
    paddingRight: 4,
    minHeight,
    justifyContent: 'center',
  },
  topRow: {
    minHeight: 36
  },
  labelText: {
    fontStyle: 'italic',
  },
});

const CellValue = ({ cell, model, isLeftColumn, rowIndex, colIndex }: CellValueProps): JSX.Element => {
  if (cell.type === TYPE.DIMENSION) {
    return <DimensionCell
      cell={cell}
      model={model}
      rowIndex={rowIndex}
      colIndex={colIndex}
      style={isLeftColumn ? styles.cell : [styles.cell, styles.topRow]}
      isLeftColumn={isLeftColumn}
    />
  }

  if (cell.type === TYPE.MEASURE) {
    return <MeasureCell
      cell={cell}
      style={styles.cell}
    />
  }

  if (cell.type === TYPE.LABEL) {
    return (
      <View style={[styles.label, styles.topRow]}>
        <Text style={[sharedStyles.text, styles.labelText]}>{cell.value}</Text>
      </View>)
  }

  return <View style={styles.cell}>{null}</View>
};

export default CellValue;
