import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Model } from '../../types/types';
import { Cell, TYPE } from '../handle-data';
import DimensionCell from './DimensionCell';
import MeasureCell from './MeasureCell';
import sharedStyles from './shared-styles';

export interface CellFactoryProps {
  cell: Cell;
  rowIndex: number;
  colIndex: number;
  model: Model;
  isLeftColumn?: boolean;
  isHeader?: boolean;
}

const borderColor = 'rgb(230, 230, 230)';
const color = 'rgb(89, 89, 89)';
const minHeight = 24;

const styles = StyleSheet.create({
  mergedCell: {
    borderLeftWidth: 0,
    borderBottomWidth: 1,
    borderColor,
  },
  cell: {
    color,
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
    color,
    borderLeftWidth: 1,
    borderBottomWidth: 1,
    borderColor,
    paddingLeft: 4,
    paddingRight: 4,
    minHeight,
    justifyContent: 'center',
  },
  header: {
    minHeight: 36
  },
  labelText: {
    fontStyle: 'italic',
  },
});

const CellFactory = ({ cell, model, isLeftColumn = false, isHeader = false, rowIndex, colIndex }: CellFactoryProps): JSX.Element => {
  if (cell.type === TYPE.DIMENSION) {
    return <DimensionCell
      cell={cell}
      model={model}
      rowIndex={rowIndex}
      colIndex={colIndex}
      style={isHeader ? [styles.cell, styles.header] : styles.cell}
      isLeftColumn={isLeftColumn}
    />
  }

  if (cell.type === TYPE.MEASURE) {
    return <MeasureCell cell={cell} style={styles.cell} />
  }

  if (cell.type === TYPE.LABEL) {
    return (
      <View style={[styles.label, styles.header]}>
        <Text style={[sharedStyles.text, styles.labelText]}>{cell.value}</Text>
      </View>)
  }

  if (isHeader) {
    return <View style={[styles.mergedCell, styles.header]}>{null}</View>
  }

  return <View style={styles.cell}>{null}</View>
};

export default CellFactory;
