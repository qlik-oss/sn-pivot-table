import { stardust } from '@nebula.js/stardust';
import React, { memo, useLayoutEffect } from 'react';
import { VariableSizeList, areEqual } from 'react-window';
import { DataModel, PivotDimensionCellWithPosition } from '../../types/types';
import ListCellFactory from './cells/ListCellFactory';
// import useDebug from '../../hooks/use-debug';
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

const getLeafNodes = (root: EngineAPI.INxPivotDimensionCell[], nodes: EngineAPI.INxPivotDimensionCell[]): EngineAPI.INxPivotDimensionCell[] => root.reduce((ary: EngineAPI.INxPivotDimensionCell[], cell) => {
  if (cell.qSubNodes.length) {
    return getLeafNodes(cell.qSubNodes, ary);
  }

  ary.push(cell);

  return ary;
}, nodes);

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
  if (dataModel.pivotData.size.data.x === 0) {
    return null;
  }

  const MemoizedListCellFactory = memo(ListCellFactory, areEqual);
  // useDebug('TopGrid', {
  //   dataModel,
  //   topGridRef,
  //   columnWidthCallback,
  //   rowHightCallback,
  //   width,
  //   height,
  //   constraints,
  //   getScrollLeft,
  //   totalMeasureInfoColumnWidth
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
    if (cell.qSubNodes.length) {
      const leftNodes = getLeafNodes([cell], []);

      return leftNodes.reduce((size, _, index) =>
        size + getMeasureInfoWidth(dataModel.pivotData.measureInfoIndexMap[cell.x + index]),
        0);
    }

    return getMeasureInfoWidth(dataModel.pivotData.measureInfoIndexMap[cell.x]);
  };

  return (<div>
    {dataModel.pivotData.top.map((list, topRowIndex) => (
      <VariableSizeList
        key={list.map(c => c.qElemNo).join(',')}
        ref={r => {
          if (topGridRef.current) {
            topGridRef.current[topRowIndex] = r as VariableSizeList; // eslint-disable-line no-param-reassign
          }
        }}
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
      >
        {MemoizedListCellFactory}
      </VariableSizeList>
    ))}
  </div>);
};

export default TopGrid;
