import React from 'react';
import { StyleSheet, View } from "react-native";
import { Model } from '../../types/types';
import { Cell, PivotData } from '../handle-data';
import CellValue from './CellValue';

interface ColumnProps {
  item: Cell[];
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
  },
});

const Column = ({ item: cells, index: colIndex, model, pivotData }: ColumnProps): JSX.Element => (
  <View style={styles.column}>
    {cells.slice(0, pivotData.nbrTopRows).map((cell, rowIndex) => <CellValue
      key={cell.key}
      cell={cell}
      rowIndex={rowIndex}
      colIndex={colIndex - pivotData.nbrLeftColumns}
      model={model}
      isLeftColumn={false}
      isHeader
    />)}
    {cells.slice(pivotData.nbrTopRows).map((cell, rowIndex) => <CellValue
      key={cell.key}
      cell={cell}
      rowIndex={rowIndex}
      colIndex={colIndex}
      model={model}
      isLeftColumn
    />)}
  </View>
)

export default Column;
