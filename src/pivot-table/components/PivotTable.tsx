import React, { useRef, useCallback } from 'react';
import { VariableSizeGrid } from 'react-window';
import { DataModel, Rect } from '../../types/types';
import useDebug from '../../hooks/use-debug';
import StickyContainer from './StickyContainer';
import ScrollableContainer from './ScrollableContainer';
import FullSizeContainer from './FullSizeContainer';
import HeaderGrid from './HeaderGrid';
import TopGrid from './TopGrid';
import LeftGrid from './LeftGrid';
import DataGrid from './DataGrid';

export interface PivotTableProps {
  rect: Rect;
  constraints: Stardust.Constraints;
  dataModel: DataModel;
}

const DEFAULT_COLUMN_WIDTH = 100;

const DEFAULT_ROW_HEIGHT = 28;

const getColumnWidth = (rect: Rect, columnCount: number) => Math.max(DEFAULT_COLUMN_WIDTH, (rect.width-15) / columnCount);

const rowHightCallback = () => DEFAULT_ROW_HEIGHT;

export const StickyPivotTable = ({
  rect,
  constraints,
  dataModel
}: PivotTableProps): JSX.Element => {
  const topGridRef = useRef<VariableSizeGrid>(null);
  const leftGridRef = useRef<VariableSizeGrid>(null);
  const dataGridRef = useRef<VariableSizeGrid>(null);
  const onScroll = (event: React.SyntheticEvent) => {
    if (topGridRef.current) {
      // console.debug(event)
      topGridRef.current.scrollTo({ scrollLeft: event.currentTarget.scrollLeft, scrollTop: event.currentTarget.scrollTop });
    }

    if (leftGridRef.current) {
      leftGridRef.current.scrollTo({ scrollLeft: event.currentTarget.scrollLeft, scrollTop: event.currentTarget.scrollTop });
    }

    if (dataGridRef.current) {
      dataGridRef.current.scrollTo({ scrollLeft: event.currentTarget.scrollLeft, scrollTop: event.currentTarget.scrollTop });
    }
  };
  const columnWidth = getColumnWidth(rect, dataModel.stickyData.size.columns);

  const columnWidthCallback = useCallback(() => columnWidth, [columnWidth]);

  useDebug('PivotTable', {
    rect,
    constraints,
    stickyData: dataModel.stickyData,
    columnWidth,
    hasMoreRows: dataModel.hasMoreRows,
    hasMoreColumns: dataModel.hasMoreColumns
  });

  const leftGridWidth = columnWidth * dataModel.stickyData.left.length;
  const headerGridWidth = leftGridWidth;
  const topGridWidth = rect.width - leftGridWidth;
  const dataGridWidth = topGridWidth;

  const headerGridHeight = DEFAULT_ROW_HEIGHT * dataModel.stickyData.headers[0].length;
  const leftGridHeight = rect.height - headerGridHeight;
  const topGridHeight = headerGridHeight;
  const dataGridHeight = leftGridHeight;

  return (
    <ScrollableContainer rect={rect} onScroll={onScroll} constraints={constraints} >
      <FullSizeContainer
        width={columnWidth * dataModel.stickyData.size.columns}
        height={DEFAULT_ROW_HEIGHT * dataModel.stickyData.size.rows}
      >
        <StickyContainer
          rect={rect}
          leftColumnsWidth={columnWidth * dataModel.stickyData.nbrLeftColumns}
          rightColumnsWidth={columnWidth * dataModel.stickyData.data.length}
          topRowsHeight={DEFAULT_ROW_HEIGHT * dataModel.stickyData.nbrTopRows}
          bottomRowsHeight={DEFAULT_ROW_HEIGHT * dataModel.stickyData.data[0].length}
        >
          <HeaderGrid
            dataModel={dataModel}
            columnWidthCallback={columnWidthCallback}
            rowHightCallback={rowHightCallback}
            width={headerGridWidth}
            height={headerGridHeight}
          />

          <TopGrid
            dataModel={dataModel}
            constraints={constraints}
            topGridRef={topGridRef}
            columnWidthCallback={columnWidthCallback}
            rowHightCallback={rowHightCallback}
            width={topGridWidth}
            height={topGridHeight}
          />

          <LeftGrid
            dataModel={dataModel}
            constraints={constraints}
            leftGridRef={leftGridRef}
            columnWidthCallback={columnWidthCallback}
            rowHightCallback={rowHightCallback}
            width={leftGridWidth}
            height={leftGridHeight}
          />

          <DataGrid
            dataModel={dataModel}
            dataGridRef={dataGridRef}
            columnWidthCallback={columnWidthCallback}
            rowHightCallback={rowHightCallback}
            width={dataGridWidth}
            height={dataGridHeight}
          />
        </StickyContainer>
      </FullSizeContainer>
    </ScrollableContainer>
  );
};
