import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { NxPivotValuePoint } from '../../types/QIX';
import { Cell } from '../handle-data';
import sharedStyles from './shared-styles';

export interface MeasureCellProps {
  cell: Cell;
  style: ViewStyle;
}

const styles = StyleSheet.create({
  numeric: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  null: {
    alignItems: 'center',
    backgroundColor: '#f2f2f2',
  }
})

const MeasureCell = ({ cell, style }: MeasureCellProps): JSX.Element => {
  const { qNum, qText } = (cell.value as NxPivotValuePoint);
  const s = qNum === 'NaN' ?
    [style, styles.null] :
    [style, styles.numeric];

  return (
    <View style={s}>
      <Text style={sharedStyles.text} numberOfLines={1}>{qText}</Text>
    </View>
  )
};

export default MeasureCell;
