import { stardust } from '@nebula.js/stardust';
import React, { memo, useLayoutEffect } from 'react';
import { VariableSizeList, areEqual } from 'react-window';
import { DataModel, PivotDimensionCellWithPosition } from '../../types/types';
import ListCellFactory from './cells/ListCellFactory';
// import useDebug from '../../hooks/use-debug';
import { gridBorderStyle } from './shared-styles';
import NxDimCellType from '../../types/QIX';

interface TopGridProps {
  dataModel: DataModel;
  topGridRef: React.RefObject<VariableSizeList[]>;
  columnWidthCallback: (index: number) => number;
  rowHightCallback: () => number;
  width: number;
  height: number;
  constraints: stardust.Constraints;
  totalDataColumnWidth: number;
  getScrollLeft: () => number;
}

const listStyle: React.CSSProperties = {
  overflow: 'hidden',
};

const bottomListStyle: React.CSSProperties = {
  borderWidth: '0px 0px 1px 0px',
  ...gridBorderStyle
};

const countLeafNodes = (root: EngineAPI.INxPivotDimensionCell[], start = 0): number => root.reduce((count, cell) => {
  const ary = cell.qSubNodes.filter(c => c.qType !== NxDimCellType.NX_DIM_CELL_PSEUDO);
  if (ary.length) {
    return countLeafNodes(ary, count);
  }

  return count + 1;
}, start);

const TopGrid = ({
  dataModel,
  topGridRef,
  columnWidthCallback,
  rowHightCallback,
  width,
  height,
  constraints,
  totalDataColumnWidth,
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
    if (cell.qType !== NxDimCellType.NX_DIM_CELL_PSEUDO) {
      return totalDataColumnWidth * countLeafNodes([cell]);
    }

    return columnWidthCallback(colIndex);
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
          totalDataColumnWidth,
        }}
      >
        {MemoizedListCellFactory}
      </VariableSizeList>
    ))}
  </div>);
};

export default TopGrid;
