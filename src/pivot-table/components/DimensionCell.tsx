import React from 'react';
import { DataTable, Text } from 'react-native-paper';
import { Pressable, StyleSheet, View } from "react-native";
import { Model } from '../../types/types';
import { NxPivotDimensionCell } from '../../types/QIX';
import { Cell } from '../handle-data';

export interface DimensionCellProps {
  cell: Cell;
  model: Model;
  rowIndex: number;
  colIndex: number;
  isLeftColumn?: boolean;
  style: Record<string, unknown>;
}

const PATH = '/qHyperCubeDef';

const styles = StyleSheet.create({
  text: {
    fontWeight: '700',
    fontSize: 13,
    color: 'rgb(89, 89, 89)',
  },
});

const DimensionCell = ({ model, cell, isLeftColumn = false, rowIndex = 0, colIndex = 0, style }: DimensionCellProps): JSX.Element => {
  const dimCell = (cell.value as NxPivotDimensionCell);
  let cellContent = dimCell.qText;
  let onPress;

  if (dimCell.qCanExpand) {
    cellContent = `+ ${dimCell.qText}`;
    onPress = isLeftColumn
      ? () => model.expandLeft(PATH, rowIndex, colIndex, false)
      : () => model.expandTop(PATH, rowIndex, colIndex, false);
  } else if (dimCell.qCanCollapse) {
    cellContent = `- ${dimCell.qText}`;
    onPress = isLeftColumn
      ? () => model.collapseLeft(PATH, rowIndex, colIndex, false)
      : () => model.collapseTop(PATH, rowIndex, colIndex, false);
  }

  return (
    <Pressable onPress={onPress}>
      <View style={style}>
        <Text style={styles.text} numberOfLines={1}>{cellContent}</Text>
      </View>
    </Pressable>
  );
};

export default DimensionCell;
