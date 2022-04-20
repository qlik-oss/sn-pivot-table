import { stardust } from '@nebula.js/stardust';
import React, { useRef, useCallback, useLayoutEffect } from 'react';
import { VariableSizeGrid, VariableSizeList } from 'react-window';
import { DataModel, Rect, ScrollService } from '../../types/types';
// import useDebug from '../hooks/use-debug';
import StickyContainer from './StickyContainer';
import ScrollableContainer from './ScrollableContainer';
import FullSizeContainer from './FullSizeContainer';
import HeaderGrid from './HeaderGrid';
import TopGrid from './TopGrid';
import LeftGrid from './LeftGrid';
import DataGrid from './DataGrid';
import useColumnWidth from '../hooks/use-column-width';

export interface PivotTableProps {
  rect: Rect;
  constraints: stardust.Constraints;
  dataModel: DataModel;
  scrollService: ScrollService;
}

const DEFAULT_ROW_HEIGHT = 28;

const rowHightCallback = () => DEFAULT_ROW_HEIGHT;

export const StickyPivotTable = ({
  rect,
  constraints,
  dataModel,
  scrollService
}: PivotTableProps): JSX.Element => {
  const scrollableContainerRef = useRef<HTMLDivElement>(null);
  const topGridRef = useRef<VariableSizeList[]>([]);
  const leftGridRef = useRef<VariableSizeList[]>([]);
  const dataGridRef = useRef<VariableSizeGrid>(null);
  const currentScrollLeft = useRef<number>(0);
  const currentScrollTop = useRef<number>(0);
  const {
    leftGridWidth,
    rightGridWidth,
    getLeftColumnWidth,
    getMeasureInfoWidth,
    getTotalWidth,
  } = useColumnWidth(dataModel, rect);
  const { size } = dataModel.pivotData;

  useLayoutEffect(() => {
    if (scrollService.shouldResetScroll && scrollableContainerRef.current) {
      scrollableContainerRef.current.scrollLeft = 0;
      scrollableContainerRef.current.scrollTop = 0;
    }
  });

  const onScroll = (event: React.SyntheticEvent) => {
    if (topGridRef.current) {
      topGridRef.current.forEach(list => list?.scrollTo(event.currentTarget.scrollLeft));
    }

    if (leftGridRef.current) {
      leftGridRef.current.forEach(list => list?.scrollTo(event.currentTarget.scrollTop));
    }

    if (dataGridRef.current) {
      dataGridRef.current.scrollTo({ scrollLeft: event.currentTarget.scrollLeft, scrollTop: event.currentTarget.scrollTop });
    }

    if (typeof currentScrollLeft.current !== 'undefined') {
      // Set scrollLeft here so that when a top grid is expanded with a new row, scroll that row to scrollLeft position.
      // Otherwise it will be out-of-sync with the other rows.
      currentScrollLeft.current = event.currentTarget.scrollLeft;
    }

    if (typeof currentScrollTop.current !== 'undefined') {
      // Set scrollTop here so that when a left grid is expanded with a new column, scroll that row to scrollTop position.
      // Otherwise it will be out-of-sync with the other columns.
      currentScrollTop.current = event.currentTarget.scrollTop;
    }
  };

  const getScrollLeft = useCallback(() => currentScrollLeft.current, [currentScrollLeft]);
  const getScrollTop = useCallback(() => currentScrollTop.current, [currentScrollTop]);

  // useDebug('PivotTable', {
  //   rect,
  //   constraints,
  //   dataModel,
  //   scrollService
  // });

  const headerGridHeight = DEFAULT_ROW_HEIGHT * size.headers.y;
  const leftGridHeight = rect.height - headerGridHeight;
  const topGridHeight = DEFAULT_ROW_HEIGHT * size.top.y;
  const dataGridHeight = rect.height - headerGridHeight;

  return (
    <ScrollableContainer ref={scrollableContainerRef} rect={rect} onScroll={onScroll} constraints={constraints} >
      <FullSizeContainer width={getTotalWidth()} height={DEFAULT_ROW_HEIGHT * size.totalRows}>
        <StickyContainer
          rect={rect}
          leftColumnsWidth={leftGridWidth}
          rightColumnsWidth={rightGridWidth}
          topRowsHeight={DEFAULT_ROW_HEIGHT * size.top.y}
          bottomRowsHeight={DEFAULT_ROW_HEIGHT * size.data.y}
        >
          <HeaderGrid
            dataModel={dataModel}
            columnWidthCallback={getLeftColumnWidth}
            rowHightCallback={rowHightCallback}
            width={leftGridWidth}
            height={headerGridHeight}
          />

          <TopGrid
            dataModel={dataModel}
            constraints={constraints}
            topGridRef={topGridRef}
            getMeasureInfoWidth={getMeasureInfoWidth}
            rowHightCallback={rowHightCallback}
            width={rightGridWidth}
            height={topGridHeight}
            getScrollLeft={getScrollLeft}
          />

          <LeftGrid
            dataModel={dataModel}
            constraints={constraints}
            leftGridRef={leftGridRef}
            getLeftColumnWidth={getLeftColumnWidth}
            width={leftGridWidth}
            height={leftGridHeight}
            getScrollTop={getScrollTop}
          />

          <DataGrid
            dataModel={dataModel}
            dataGridRef={dataGridRef}
            getMeasureInfoWidth={getMeasureInfoWidth}
            rowHightCallback={rowHightCallback}
            width={rightGridWidth}
            height={dataGridHeight}
            scrollService={scrollService}
          />
        </StickyContainer>
      </FullSizeContainer>
    </ScrollableContainer>
  );
};
