import React from 'react';
import { StyleSheet, Text, View } from "react-native";
import { NxPivotValuePoint } from '../../types/QIX';
import { Model } from '../../types/types';
import { Cell, PivotData, TYPE } from '../handle-data';
import DimensionCell from './DimensionCell';
import MeasureCell from './MeasureCell';
import sharedStyles from './shared-styles';

interface ColumnTableProps {
  item: Array<Cell>;
  index: number;
  model: Model;
  pivotData: PivotData;
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    overflow: 'hidden',
  },
  column: {
    height: '100%',
    width: '100%',
    minWidth: '50px',
    // borderWidth: 1,
    // borderColor: 'red'
    // flex: 1,
  },
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
});

const renderCell = (cell: Cell, rowIndex = 0, colIndex = 0, model: Model, isLeftColumn = false) => {
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

  return <View style={styles.cell}>{null}</View>
};

const ColumnTable = ({ item: cells, index: colIndex, model, pivotData }: ColumnTableProps): JSX.Element => (
  <View style={styles.column}>
    {cells.slice(0, pivotData.nbrTopRows).map((cell, rowIndex) => renderCell(cell, rowIndex, colIndex - pivotData.nbrLeftColumns, model, false))}
    {cells.slice(pivotData.nbrTopRows).map((cell, rowIndex) => renderCell(cell, rowIndex, colIndex, model, true))}
  </View>
)

export default ColumnTable;
