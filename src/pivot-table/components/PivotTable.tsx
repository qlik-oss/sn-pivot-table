import React from 'react';
import { DataTable } from 'react-native-paper';
import HeaderCell from './HeaderCell';
import { Model, PivotTableData } from '../../types';

export interface PivotTableProps {
  pivotData: PivotTableData;
  model: Model;
}

const PivotTable = ({ pivotData: { leftColumns, topColumns, rows }, model }: PivotTableProps): JSX.Element => (
  <DataTable style={{ height: '100%' }}>
    <DataTable.Header>
      {leftColumns.headers.map((header) => (
        <DataTable.Title>{header.qFallbackTitle}</DataTable.Title>
      ))}
      {topColumns.items.map((column) => (
        <DataTable.Title key={column.qText}>{column.qText}</DataTable.Title>
      ))}
    </DataTable.Header>
    <div style={{ overflow: 'auto' }}>
      {rows.map((row, rowIndex) => (
        <DataTable.Row key={JSON.stringify(row)}>
          {leftColumns.headers.map((header, headerIndex) => {
            const { qElemNo, column } = leftColumns.items[rowIndex];
            return headerIndex === column ? (
              <HeaderCell
                indexKey={`left-column-${qElemNo}`}
                element={leftColumns.items[rowIndex]}
                model={model}
                rowNumber={rowIndex}
              />
            ) : (
              <DataTable.Cell> - </DataTable.Cell>
            );
          })}
          {row.map(({ qElemNo, qText }) => (
            <DataTable.Cell key={qElemNo}>{qText}</DataTable.Cell>
          ))}
        </DataTable.Row>
      ))}
    </div>
  </DataTable>
);

export default PivotTable;
