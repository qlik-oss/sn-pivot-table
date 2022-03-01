import { stardust } from '@nebula.js/stardust';
import React, { memo, useLayoutEffect } from 'react';
import { VariableSizeList, areEqual } from 'react-window';
import { DataModel } from '../../types/types';
import CellFactory from './cells/TopGridCellFactory';
import useDebug from '../../hooks/use-debug';
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

const gridStyle: React.CSSProperties = {
  overflow: 'hidden',
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

  const MemoizedCellFactory = memo(CellFactory, areEqual);
  useDebug('TopGrid', {
    dataModel,
    topGridRef,
    columnWidthCallback,
    rowHightCallback,
    width,
    height,
    constraints,
    getScrollLeft
  });

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

  return (<div>
    {dataModel.pivotData.top.map((list, topRowIndex) => (
      <VariableSizeList
        key={topRowIndex}
        ref={r => {
          if (topGridRef.current) {
            topGridRef.current[topRowIndex] = r as VariableSizeList;
          }
        }}
        style={gridStyle}
        height={height / dataModel.pivotData.size.top.y}
        width={width}
        itemCount={list.length}
        itemSize={(colIndex) =>{
          const cell = list[colIndex];

          if (cell === null || typeof cell === 'string') return columnWidthCallback(colIndex);

          if (cell.qType !== NxDimCellType.NX_DIM_CELL_PSEUDO) {
            return totalDataColumnWidth * countLeafNodes([cell]);
          }

          return columnWidthCallback(colIndex);
        }
        }
        layout="horizontal"
        itemData={{
          dataModel,
          constraints,
          matrix: list,
          isHeader: true,
          totalDataColumnWidth,
        }}
      >
        {MemoizedCellFactory}
      </VariableSizeList>
    ))}
  </div>);
};

export default TopGrid;
