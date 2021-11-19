import React from 'react';
import { Pressable, StyleSheet, View, Text, ViewStyle } from "react-native";
import { Model } from '../../types/types';
import { NxDimCellType, NxPivotDimensionCell } from '../../types/QIX';
import { Cell } from '../handle-data';
import sharedStyles from './shared-styles';

export interface DimensionCellProps {
  cell: Cell;
  model: Model;
  rowIndex: number;
  colIndex: number;
  isLeftColumn?: boolean;
  style: ViewStyle | ViewStyle[];
}

const PATH = '/qHyperCubeDef';

const styles = StyleSheet.create({
  text: {
    fontWeight: '700',
  },
});

const DimensionCell = ({ model, cell, isLeftColumn = false, rowIndex = 0, colIndex = 0, style }: DimensionCellProps): JSX.Element => {
  const { qText, qCanCollapse, qCanExpand } = (cell.value as NxPivotDimensionCell);
  let cellContent = qText;
  let onPress;

  if (qCanExpand) {
    cellContent = `+ ${qText}`;
    onPress = isLeftColumn
      ? () => model.expandLeft(PATH, rowIndex, colIndex, false)
      : () => model.expandTop(PATH, rowIndex, colIndex, false);
  } else if (qCanCollapse) {
    cellContent = `- ${qText}`;
    onPress = isLeftColumn
      ? () => model.collapseLeft(PATH, rowIndex, colIndex, false)
      : () => model.collapseTop(PATH, rowIndex, colIndex, false);
  }

  const DimCell = (
    <View style={style}>
      <Text
        style={[sharedStyles.text, styles.text]}
        numberOfLines={1}>
          {cellContent}
      </Text>
    </View>
  );

  return onPress ?
  <Pressable onPress={onPress}>{DimCell}</Pressable>
  : DimCell;
};

export default DimensionCell;
