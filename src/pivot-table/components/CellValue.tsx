import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Model } from '../../types/types';
import { Cell, TYPE } from '../handle-data';
import DimensionCell from './DimensionCell';
import MeasureCell from './MeasureCell';

export interface CellValueProps {
  cell: Cell;
  rowIndex: number;
  colIndex: number;
  model: Model;
  isLeftColumn: boolean;
}

const styles = StyleSheet.create({
  cell: {
    borderLeftWidth: 1,
    borderBottomWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.12)',
    paddingLeft: 4,
    paddingRight: 4,
    minHeight: 48,
    justifyContent: 'center',
  },
  nullCell: {
    borderLeftWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.12)',
    backgroundColor: '#ccc',
    paddingLeft: 4,
    paddingRight: 4,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 48,
  },
  label: {
    fontWeight: 500,
    color: 'rgba(0, 0, 0, 0.6)',
    borderLeftWidth: 1,
    borderBottomWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.12)',
    paddingLeft: 4,
    paddingRight: 4,
    minHeight: 48,
    justifyContent: 'center',
  },
});

const CellValue = ({ cell, model, isLeftColumn, rowIndex, colIndex }: CellValueProps): JSX.Element => {
  if (cell.type === TYPE.DIMENSION) {
    return <DimensionCell
      cell={cell}
      model={model}
      rowIndex={rowIndex}
      colIndex={colIndex}
      style={styles.cell}
      isLeftColumn={isLeftColumn}
    />
  }

  if (cell.type === TYPE.MEASURE) {
    return <MeasureCell
      cell={cell}
      style={styles.cell}
      nullStyle={styles.nullCell}
    />
  }

  if (cell.type === TYPE.LABEL) {
    return (
      <View style={styles.label}>
        <Text>{cell.value}</Text>
      </View>)
  }

  return <View style={styles.cell}>{null}</View>
};

export default CellValue;
