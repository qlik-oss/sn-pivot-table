import React from 'react';
import { DataTable } from 'react-native-paper';
import HeaderCell from './HeaderCell';

const PivotTable = ({ pivotData: { leftColumns, qTop, rows }, model }) => (
  <DataTable>
    <DataTable.Header>
      {leftColumns.headers.map((header) => (
        <DataTable.Cell>{header.qFallbackTitle}</DataTable.Cell>
      ))}
      {qTop.map((column, index) => (
        <DataTable.Cell key={index}>{column.qText}</DataTable.Cell>
      ))}
    </DataTable.Header>

    {rows.map((row, rowIndex) => (
      <DataTable.Row key={rowIndex}>
        {leftColumns.headers.map((header, headerIndex) => {
          const { qElemNo, column } = leftColumns.items[rowIndex];
          return headerIndex === column ? (
            <HeaderCell
              indexKey={`left-column-${leftColumns.items[rowIndex].qElemNo}`}
              element={leftColumns.items[rowIndex]}
              model={model}
              rowNumber={rowIndex}
            />
          ) : (
            <DataTable.Cell />
          );
        })}
        {row.map(({ qElemNo, qText }) => (
          <DataTable.Cell key={qElemNo}>{qText}</DataTable.Cell>
        ))}
      </DataTable.Row>
    ))}
  </DataTable>
);

export default PivotTable;
