import { stardust } from '@nebula.js/stardust';
import React, { memo, useLayoutEffect } from 'react';
import { VariableSizeList, areEqual } from 'react-window';
import { PSEUDO_DIMENSION_INDEX } from '../../constants';
import { DataModel, PivotDimensionCellWithPosition } from '../../types/types';
import ListCellFactory from './cells/ListCellFactory';
import getItemKey from './helpers/get-item-key';
import setListRef from './helpers/set-list-ref';
// import useDebug from '../hooks/use-debug';
import { gridBorderStyle } from './shared-styles';

interface TopGridProps {
  dataModel: DataModel;
  topGridRef: React.RefObject<VariableSizeList[]>;
  getMeasureInfoWidth: (index: number) => number;
  rowHightCallback: () => number;
  width: number;
  height: number;
  constraints: stardust.Constraints;
  getScrollLeft: () => number;
}

const listStyle: React.CSSProperties = {
  overflow: 'hidden',
};

const bottomListStyle: React.CSSProperties = {
  borderWidth: '0px 0px 1px 0px',
  ...gridBorderStyle
};

const TopGrid = ({
  dataModel,
  topGridRef,
  getMeasureInfoWidth,
  rowHightCallback,
  width,
  height,
  constraints,
  getScrollLeft
}: TopGridProps): JSX.Element | null => {
  if (dataModel.pivotData.size.top.y === 0) {
    return null;
  }

  const MemoizedListCellFactory = memo(ListCellFactory, areEqual);
  // useDebug('TopGrid', {
  //   dataModel,
  //   topGridRef,
  //   getMeasureInfoWidth,
  //   rowHightCallback,
  //   width,
  //   height,
  //   constraints,
  //   getScrollLeft
  // });

  useLayoutEffect(() => {
    if (topGridRef.current) {
      topGridRef.current.forEach(list => list?.resetAfterIndex(0));
    }
  }, [dataModel, width, height]);

  useLayoutEffect(() => {
    if (topGridRef.current) {
      topGridRef.current.forEach(list => list?.scrollTo(getScrollLeft()));
    }
  });

  const getItemSizeCallback = (list: PivotDimensionCellWithPosition[]) => (colIndex: number) =>{
    const cell = list[colIndex];
    if (cell.leafCount > 0) {
      let size = 0;
      for (let index = 0; index < cell.leafCount; index++) { // eslint-disable-line no-plusplus
        const measureInfoIndex = dataModel.getMeasureInfoIndexFromCellIndex(cell.x + index);
        size += getMeasureInfoWidth(measureInfoIndex);
      }

      return size;
    }

    return getMeasureInfoWidth(dataModel.getMeasureInfoIndexFromCellIndex(cell.x));
  };

  const getKey = (rowIndex: number): string => {
    const dimIndex = dataModel.pivotData.topDimensionInfoIndexMap[rowIndex];
    if (dimIndex === PSEUDO_DIMENSION_INDEX) {
      return '-1';
    }
    return `${dataModel.getDimensionInfo()[dimIndex].qFallbackTitle}-${dimIndex}`;
  };

  return (<div>
    {dataModel.pivotData.top.map((list, topRowIndex) => (
      <VariableSizeList
        key={getKey(topRowIndex)}
        ref={setListRef(topGridRef, topRowIndex)}
        style={topRowIndex === dataModel.pivotData.top.length - 1 ? { ...listStyle, ...bottomListStyle } : listStyle}
        height={rowHightCallback()}
        width={width}
        itemCount={list.length}
        itemSize={getItemSizeCallback(list)}
        layout="horizontal"
        itemData={{
          dataModel,
          constraints,
          list,
        }}
        itemKey={getItemKey}
      >
        {MemoizedListCellFactory}
      </VariableSizeList>
    ))}
  </div>);
};

export default TopGrid;
