import React from 'react';
import { View, Text } from 'react-native';
import { NxPivotValuePoint } from '../../types/QIX';
import { Cell } from '../handle-data';

export interface MeasureCellProps {
  cell: Cell;
  style: Record<string, unknown>;
  nullStyle: Record<string, unknown>;
}

const MeasureCell = ({ cell, style, nullStyle }: MeasureCellProps): JSX.Element => {
  const { qNum, qText } = (cell.value as NxPivotValuePoint);

  return (
    <View
      style={qNum === 'NaN' ? nullStyle : style}
      // numeric={!Number.isNaN(+qText)}
    >
      <Text numberOfLines={1}>{qText}</Text>
    </View>
  )
};

export default MeasureCell;
