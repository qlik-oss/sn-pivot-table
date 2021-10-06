import React from 'react';
import { DataTable, Button } from 'react-native-paper';
import { Model } from '../../types';

export interface HeaderCellProps {
  element: { qCanExpand: boolean; qCanCollapse: boolean; qText: string; column: number };
  model: Model;
  rowNumber: number;
  indexKey: string;
}

const HeaderCell = ({ element, model, rowNumber, indexKey }: HeaderCellProps): JSX.Element => {
  const { qCanExpand, qCanCollapse, qText, column } = element;
  const openColumn = () => {
    model.expandLeft('/qHyperCubeDef', rowNumber, column, false);
  };
  const collapseColumn = () => {
    model.collapseLeft('/qHyperCubeDef', rowNumber, column, false);
  };

  return (
    <DataTable.Cell key={indexKey}>
      {qCanExpand && <Button onPress={openColumn}>+ {qText}</Button>}
      {qCanCollapse && <Button onPress={collapseColumn}>- {qText}</Button>}
      {!qCanCollapse && !qCanExpand && qText}
    </DataTable.Cell>
  );
};

export default HeaderCell;
