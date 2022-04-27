import { stardust } from '@nebula.js/stardust';
import React, { memo, useLayoutEffect, useMemo } from 'react';
import { VariableSizeList, areEqual } from 'react-window';
import { PSEUDO_DIMENSION_INDEX } from '../../../constants';
import { DataModel, Cell, LayoutService, DataService, Point } from '../../../types/types';
import ListCellFactory from '../cells/ListCellFactory';
import getItemKey from '../helpers/get-item-key';
import setListRef from '../helpers/set-list-ref';
import useDebug from '../../hooks/use-debug';
import { gridBorderStyle } from '../shared-styles';

interface TopGridProps {
  dataModel: DataModel;
  topGridRef: React.RefObject<VariableSizeList[]>;
  getMeasureInfoWidth: (index: number) => number;
  rowHightCallback: () => number;
  width: number;
  height: number;
  constraints: stardust.Constraints;
  getScrollLeft: () => number;
  layoutService: LayoutService;
  dataService: DataService;
  data: Cell[][];
  size: Point;
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
  getScrollLeft,
  layoutService,
  dataService,
  data,
  size,
}: TopGridProps): JSX.Element | null => {
  if (size.y === 0) {
    return null;
  }

  const MemoizedListCellFactory = memo(ListCellFactory, areEqual);

  const { qMeasureInfo, qDimensionInfo } = layoutService.layout.qHyperCube;

  useDebug('TopGrid', {
    dataModel,
    topGridRef,
    getMeasureInfoWidth,
    rowHightCallback,
    width,
    height,
    constraints,
    getScrollLeft,
    layoutService,
    dataService,
    data,
    size,
  });

  useLayoutEffect(() => {
    if (topGridRef.current) {
      topGridRef.current.forEach(list => list?.resetAfterIndex(0));
    }
  }, [dataModel, width, height, data]);

  useLayoutEffect(() => {
    if (topGridRef.current) {
      topGridRef.current.forEach(list => list?.scrollTo(getScrollLeft()));
    }
  });

  const allMeasuresWidth = useMemo(
    () => qMeasureInfo.reduce((totalWidth, measure, index) => totalWidth + getMeasureInfoWidth(index), 0),
    [getMeasureInfoWidth, qMeasureInfo]
  );

  const getItemSizeCallback = (list: Cell[]) => (colIndex: number) =>{
    const cell = list[colIndex];
    if (cell.leafCount > 0) {
      const measureInfoCount = qMeasureInfo.length;
      return (cell.leafCount / measureInfoCount) * allMeasuresWidth;
    }

    return getMeasureInfoWidth(layoutService.getMeasureInfoIndexFromCellIndex(cell.x));
  };

  const getKey = (rowIndex: number): string => {
    const dimIndex = dataService.data.topDimensionInfoIndexMap[rowIndex];
    if (dimIndex === PSEUDO_DIMENSION_INDEX) {
      return '-1';
    }
    return `${qDimensionInfo[dimIndex].qFallbackTitle}-${dimIndex}`;
  };

  return (<div>
    {data.map((list, topRowIndex) => (
      <VariableSizeList
        key={getKey(topRowIndex)}
        ref={setListRef(topGridRef, topRowIndex)}
        style={topRowIndex === data.length - 1 ? { ...listStyle, ...bottomListStyle } : listStyle}
        height={rowHightCallback()}
        width={width}
        itemCount={list.length}
        itemSize={getItemSizeCallback(list)}
        layout="horizontal"
        itemData={{
          layoutService,
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
