import React, { useRef, useCallback } from 'react';
import { VariableSizeGrid } from 'react-window';
import { DataModel, Rect } from '../../types/types';
// import useDebug from '../../hooks/use-debug';
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

const MIN_COLUMN_WIDTH = 100;

const DEFAULT_ROW_HEIGHT = 28;

const getColumnWidth = (rect: Rect, columnCount: number) => Math.max(MIN_COLUMN_WIDTH, rect.width / columnCount);

const rowHightCallback = () => DEFAULT_ROW_HEIGHT;

export const StickyPivotTable = ({
  rect,
  constraints,
  dataModel
}: PivotTableProps): JSX.Element => {
  const topGridRef = useRef<VariableSizeGrid>(null);
  const leftGridRef = useRef<VariableSizeGrid>(null);
  const dataGridRef = useRef<VariableSizeGrid>(null);
  const { size } = dataModel.pivotData;

  const onScroll = (event: React.SyntheticEvent) => {
    if (topGridRef.current) {
      topGridRef.current.scrollTo({ scrollLeft: event.currentTarget.scrollLeft, scrollTop: 0 });
    }

    if (leftGridRef.current) {
      leftGridRef.current.scrollTo({ scrollLeft: 0, scrollTop: event.currentTarget.scrollTop });
    }

    if (dataGridRef.current) {
      dataGridRef.current.scrollTo({ scrollLeft: event.currentTarget.scrollLeft, scrollTop: event.currentTarget.scrollTop });
    }
  };

  const columnWidth = getColumnWidth(rect, size.totalColumns);

  const columnWidthCallback = useCallback(() => columnWidth, [columnWidth]);

  // useDebug('PivotTable', {
  //   rect,
  //   dataModel,
  //   columnWidth,
  // });

  const leftGridWidth = columnWidth * size.left.x;
  const headerGridWidth = columnWidth * size.headers.x;
  const topGridWidth = rect.width - leftGridWidth;
  const dataGridWidth = rect.width - leftGridWidth;

  const headerGridHeight = DEFAULT_ROW_HEIGHT * size.headers.y;
  const leftGridHeight = rect.height - headerGridHeight;
  const topGridHeight = DEFAULT_ROW_HEIGHT * size.top.y;
  const dataGridHeight = rect.height - headerGridHeight;

  return (
    <ScrollableContainer rect={rect} onScroll={onScroll} constraints={constraints} >
      <FullSizeContainer
        width={columnWidth * size.totalColumns}
        height={DEFAULT_ROW_HEIGHT * size.totalRows}
      >
        <StickyContainer
          rect={rect}
          leftColumnsWidth={columnWidth * size.left.x}
          rightColumnsWidth={columnWidth * size.data.x}
          topRowsHeight={DEFAULT_ROW_HEIGHT * size.top.y}
          bottomRowsHeight={DEFAULT_ROW_HEIGHT * size.data.y}
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
