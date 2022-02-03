import React, { useEffect, useRef, memo } from 'react';
import { VariableSizeGrid, areEqual, GridOnItemsRenderedProps } from 'react-window';
import { DataModel, Rect } from '../../types/types';
import CellFactory from './CellFactory';
import useDebug from '../../hooks/use-debug';
import StickyContainer from './StickyContainer';
import ScrollableContainer from './ScrollableContainer';
import FullSizeContainer from './FullSizeContainer';

export interface PivotTableProps {
  rect: Rect;
  constraints: Stardust.Constraints;
  dataModel: DataModel;
}

const DEFAULT_COLUMN_WIDTH = 100;

const DEFAULT_ROW_HEIGHT = 28;

const getColumnWidth = (rect: Rect, columnCount: number) => Math.max(DEFAULT_COLUMN_WIDTH, (rect.width-15) / columnCount)

export const StickyPivotTable = ({
  rect,
  constraints,
  dataModel
}: PivotTableProps): JSX.Element => {
  const MemoizedCellFactory = memo(CellFactory, areEqual);
  const headerGridRef = useRef<VariableSizeGrid>(null);
  const topGridRef = useRef<VariableSizeGrid>(null);
  const leftGridRef = useRef<VariableSizeGrid>(null);
  const dataGridRef = useRef<VariableSizeGrid>(null);
  const onScroll = (event: React.SyntheticEvent) => {
    if (topGridRef.current) {
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

  const columnWidthCallback = () => columnWidth;
  const rowHightCallback = () => DEFAULT_ROW_HEIGHT;

  useDebug('PivotTable', {
    rect,
    constraints,
    fetchNextPage: dataModel.fetchNextPage,
    collapseLeft: dataModel.collapseLeft,
    collapseTop: dataModel.collapseTop,
    expandLeft: dataModel.expandLeft,
    expandTop: dataModel.expandTop,
    stickyData: dataModel.stickyData,
    columnWidth,
    hasMoreRows: dataModel.hasMoreRows,
    hasMoreColumns: dataModel.hasMoreColumns
  });

  useEffect(() => {
    if (headerGridRef.current) {
      headerGridRef.current.resetAfterColumnIndex(0);
    }

    if (topGridRef.current) {
      topGridRef.current.resetAfterColumnIndex(0);
    }

    if (leftGridRef.current) {
      leftGridRef.current.resetAfterColumnIndex(0);
    }

    if (dataGridRef.current) {
      dataGridRef.current.resetAfterColumnIndex(0);
    }
  }, [dataModel]);

  useEffect(() => {
    if (headerGridRef.current) {
      headerGridRef.current.resetAfterIndices({ columnIndex: 0, rowIndex: 0, shouldForceUpdate: true });
    }

    if (topGridRef.current) {
      topGridRef.current.resetAfterIndices({ columnIndex: 0, rowIndex: 0, shouldForceUpdate: true });
    }

    if (leftGridRef.current) {
      leftGridRef.current.resetAfterIndices({ columnIndex: 0, rowIndex: 0, shouldForceUpdate: true });
    }

    if (dataGridRef.current) {
      dataGridRef.current.resetAfterIndices({ columnIndex: 0, rowIndex: 0, shouldForceUpdate: true });
    }
  }, [rect.width, rect.height]);

  const onItemsRendered = ({
    visibleColumnStopIndex,
    visibleRowStopIndex
  }: GridOnItemsRenderedProps) => {
    if (dataModel.hasMoreRows && visibleRowStopIndex >= dataModel.stickyData.data[0].length - 1) {
      dataModel.fetchNextPage(true);
    } else if (dataModel.hasMoreColumns && visibleColumnStopIndex >= dataModel.stickyData.data.length - 1) {
      dataModel.fetchNextPage(false);
    }
  };

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
      <FullSizeContainer columnWidth={columnWidth} dataModel={dataModel} >
        <StickyContainer
          rect={rect}
          left={columnWidth * dataModel.stickyData.nbrLeftColumns}
          right={columnWidth * dataModel.stickyData.data.length}
          top={DEFAULT_ROW_HEIGHT * dataModel.stickyData.nbrTopRows}
          bottom={DEFAULT_ROW_HEIGHT * dataModel.stickyData.data[0].length}
        >
          <VariableSizeGrid
            ref={headerGridRef}
            style={{ overflow: 'hidden' }}
            columnCount={dataModel.stickyData.nbrLeftColumns}
            columnWidth={columnWidthCallback}
            height={headerGridHeight}
            rowCount={dataModel.stickyData.headers[0].length}
            rowHeight={rowHightCallback}
            width={headerGridWidth}
            itemData={{
              dataModel,
              constraints,
              matrix: dataModel.stickyData.headers,
              isHeader: true
            }}
          >
            {MemoizedCellFactory}
          </VariableSizeGrid>

          <VariableSizeGrid
            ref={topGridRef}
            style={{ overflow: 'hidden' }}
            columnCount={dataModel.stickyData.top.length}
            columnWidth={columnWidthCallback}
            height={topGridHeight}
            rowCount={dataModel.stickyData.top[0].length}
            rowHeight={rowHightCallback}
            width={topGridWidth}
            itemData={{
              dataModel,
              constraints,
              matrix: dataModel.stickyData.top,
              isHeader: false
            }}
          >
            {MemoizedCellFactory}
          </VariableSizeGrid>

          <VariableSizeGrid
            ref={leftGridRef}
            style={{ overflow: 'hidden' }}
            columnCount={dataModel.stickyData.nbrLeftColumns}
            columnWidth={columnWidthCallback}
            height={leftGridHeight}
            rowCount={dataModel.stickyData.left[0].length}
            rowHeight={rowHightCallback}
            width={leftGridWidth}
            itemData={{
              dataModel,
              constraints,
              matrix: dataModel.stickyData.left,
              isLeftColumn: true
            }}
          >
            {MemoizedCellFactory}
          </VariableSizeGrid>

          <VariableSizeGrid
            ref={dataGridRef}
            style={{ overflow: 'hidden' }}
            columnCount={dataModel.stickyData.data.length}
            columnWidth={columnWidthCallback}
            height={dataGridHeight}
            rowCount={dataModel.stickyData.data[0].length}
            rowHeight={rowHightCallback}
            width={dataGridWidth}
            itemData={{
              dataModel,
              constraints,
              matrix: dataModel.stickyData.data,
            }}
            onItemsRendered={onItemsRendered}
          >
            {MemoizedCellFactory}
          </VariableSizeGrid>
        </StickyContainer>
      </FullSizeContainer>
    </ScrollableContainer>
  );
};
