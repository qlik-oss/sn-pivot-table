import { stardust } from '@nebula.js/stardust';
import React, { useRef, useCallback } from 'react';
import { VariableSizeGrid, VariableSizeList } from 'react-window';
import { DataModel, Rect } from '../../types/types';
// import useDebug from '../../hooks/use-debug';
import StickyContainer from './StickyContainer';
import ScrollableContainer from './ScrollableContainer';
import FullSizeContainer from './FullSizeContainer';
import HeaderGrid from './HeaderGrid';
import TopGrid from './TopGrid';
import LeftGrid from './LeftGrid';
import DataGrid from './DataGrid';
import useColumnWidth from '../../hooks/use-column-width';

export interface PivotTableProps {
  rect: Rect;
  constraints: stardust.Constraints;
  dataModel: DataModel;
}

const DEFAULT_ROW_HEIGHT = 28;

const rowHightCallback = () => DEFAULT_ROW_HEIGHT;

export const StickyPivotTable = ({
  rect,
  constraints,
  dataModel
}: PivotTableProps): JSX.Element => {
  const topGridRef = useRef<VariableSizeList[]>([]);
  const leftGridRef = useRef<VariableSizeGrid>(null);
  const dataGridRef = useRef<VariableSizeGrid>(null);
  const currentScrollLeft = useRef<number>(0);
  const {
    leftGridWidth,
    rightGridWidth,
    getLeftColumnWidth,
    getMeasureInfoWidth,
    getTotalWidth,
  } = useColumnWidth(dataModel, rect);
  const { size } = dataModel.pivotData;

  const onScroll = (event: React.SyntheticEvent) => {
    if (topGridRef.current) {
      topGridRef.current.forEach(list => list?.scrollTo(event.currentTarget.scrollLeft));
    }

    if (leftGridRef.current) {
      leftGridRef.current.scrollTo({ scrollLeft: 0, scrollTop: event.currentTarget.scrollTop });
    }

    if (dataGridRef.current) {
      dataGridRef.current.scrollTo({ scrollLeft: event.currentTarget.scrollLeft, scrollTop: event.currentTarget.scrollTop });
    }

    if (typeof currentScrollLeft.current !== 'undefined') {
      // Set scrollLeft here so that when a top grid is expanded with a new row, scroll that row to scrollLeft position.
      // Otherwise it will be out-of-sync with the other rows.
      currentScrollLeft.current = event.currentTarget.scrollLeft;
    }
  };

  const getScrollLeft = useCallback(() => currentScrollLeft.current, [currentScrollLeft]);

  // useDebug('PivotTable', {
  //   rect,
  //   dataModel,
  // });

  const headerGridHeight = DEFAULT_ROW_HEIGHT * size.headers.y;
  const leftGridHeight = rect.height - headerGridHeight;
  const topGridHeight = DEFAULT_ROW_HEIGHT * size.top.y;
  const dataGridHeight = rect.height - headerGridHeight;

  return (
    <ScrollableContainer rect={rect} onScroll={onScroll} constraints={constraints} >
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
            columnWidthCallback={getLeftColumnWidth}
            rowHightCallback={rowHightCallback}
            width={leftGridWidth}
            height={leftGridHeight}
          />

          <DataGrid
            dataModel={dataModel}
            dataGridRef={dataGridRef}
            getMeasureInfoWidth={getMeasureInfoWidth}
            rowHightCallback={rowHightCallback}
            width={rightGridWidth}
            height={dataGridHeight}
          />
        </StickyContainer>
      </FullSizeContainer>
    </ScrollableContainer>
  );
};
