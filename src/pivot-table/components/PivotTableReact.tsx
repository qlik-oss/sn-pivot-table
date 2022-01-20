import React, { useState, useEffect, useRef, useCallback, useMemo, memo } from 'react';
import { VariableSizeGrid, areEqual } from 'react-window';
import toMatrix, { PivotData, TYPE } from '../handle-data';
import { Model, Rect } from '../../types/types';
import { Layout, NxPageArea, NxPivotDimensionCell, NxPivotValuePoint } from '../../types/QIX';
import MeasureCell from './MeasureCell';
import DimensionCell from './DimensionCell';

export interface PivotTableProps {
  model: Model;
  layout: Layout;
  rect: Rect;
}

interface GridCallbackProps {
  columnIndex: number;
  rowIndex: number;
  style: any;
  data: PivotData
}

interface BatchedState {
  matrix: PivotData;
  area: NxPageArea;
  loading: boolean;
}

interface OnItemsRenderedProps {
  overscanColumnStartIndex: number;
  overscanColumnStopIndex: number;
  overscanRowStartIndex: number;
  overscanRowStopIndex: number;
  visibleColumnStartIndex: number;
  visibleColumnStopIndex: number;
  visibleRowStartIndex: number;
  visibleRowStopIndex: number;
}

function useRenderCount() {
  const count = useRef(1)
  useEffect(() => { count.current += 1 })
  return count.current
}

function useDebugInformation(componentName: string, props: any) {
  const count = useRenderCount()
  const changedProps = useRef({})
  const previousProps = useRef(props)
  const lastRenderTimestamp = useRef(Date.now())

  const propKeys = Object.keys({ ...props, ...previousProps })
  changedProps.current = propKeys.reduce((obj, key) => {
    if (props[key] === previousProps.current[key]) return obj
    return {
      ...obj,
      [key]: { previous: previousProps.current[key], current: props[key] },
    }
  }, {})
  const info = {
    count,
    changedProps: changedProps.current,
    timeSinceLastRender: Date.now() - lastRenderTimestamp.current,
    lastRenderTimestamp: lastRenderTimestamp.current,
  }

  useEffect(() => {
    previousProps.current = props
    lastRenderTimestamp.current = Date.now()
    console.debug(componentName, info)
  })

  return info
}

const getNextRow = (qArea: NxPageArea) => {
  const { qLeft, qHeight, qWidth } = qArea;

  return {
    qLeft,
    qTop: 0,
    qWidth,
    qHeight: qHeight + 50,
  };
};

const getNextColumn = (qArea: NxPageArea) => {
  const { qTop, qHeight, qWidth } = qArea;

  return {
    qLeft: 0,
    qTop,
    qWidth: qWidth + 50,
    qHeight,
  };
};

export const PivotTable = ({ rect, layout, model }: PivotTableProps): JSX.Element => {
  const [data, setData] = useState<PivotData>({ matrix: [[]], topMatrix: [], leftMatrix: [], nbrTopRows: 0, nbrLeftColumns: 0 });
  const [qArea, setArea] = useState<NxPageArea>(layout.qHyperCube.qPivotDataPages[0].qArea);
  const [batchedState, setBatchedState] = useState<BatchedState>(); // setState call inside async functions are not batched. This is a hack get around multiple unwanted renders for each setState call.
  const [loading, setLoading] = useState(false);
  const innerRef = useRef();
  useDebugInformation('PivotTable', { rect, layout, data, loading, qArea });

  useEffect(() => console.log('innerRef', innerRef), [innerRef])

  useMemo(() => {
    if (batchedState) {
      setData(batchedState.matrix);
      setArea(batchedState.area);
      setLoading(batchedState.loading);
    }
  }, [batchedState]);

  useEffect(() => {
    if (layout) {
      console.log('LAYOUT', layout);
      const matrix = toMatrix(layout.qHyperCube.qPivotDataPages[0], layout.qHyperCube.qDimensionInfo, layout.qHyperCube.qNoOfLeftDims);
      setData(matrix);
    }
  }, [layout]);

  const GridCell = memo(({ columnIndex, rowIndex, style, data: { matrix  } }: GridCallbackProps) => {
    if (matrix.length <= columnIndex) {
      return null;
    }

    if (matrix[columnIndex].length <= rowIndex) {
      return null;
    }

    const item = matrix[columnIndex][rowIndex];
    let content = item.value;

    if (typeof item.value === 'object') {
      content = item.value.qText;
    }

    if (item.type === TYPE.DIMENSION) {
      const isLeftColumn = rowIndex >= data.nbrTopRows;

      return <DimensionCell
        cell={item}
        model={model}
        isLeftColumn={isLeftColumn}
        rowIndex={isLeftColumn ? rowIndex - data.nbrTopRows : rowIndex}
        colIndex={isLeftColumn ? columnIndex : columnIndex - data.nbrLeftColumns}
        style={style}
      />;
    }

    if (item.type === TYPE.MEASURE) {
      return <MeasureCell
        cell={item}
        style={style}
      />
    }

    const borderStyle = {
      boxSizing: 'border-box',
      padding: '4px',
      borderLeftWidth: 1,
      borderBottomWidth: 1,
      borderRightWidth: 0,
      borderTopWidth: 0,
      borderColor: 'rgb(230, 230, 230)',
      borderStyle: 'solid',
    };

    return (
      <div style={{ ...style, ...borderStyle }}>
        {content}
      </div>
    );
  }, areEqual);

  const onReachedEndHandler = useCallback(async (isRow) => {
    if (loading) return;

    setLoading(true);

    try {
      const [pivotPage] = await model.getHyperCubePivotData({
        "qPath": "/qHyperCubeDef",
        "qPages": [isRow ? getNextRow(qArea) : getNextColumn(qArea)]
      });
      const matrix = toMatrix(pivotPage, layout.qHyperCube.qDimensionInfo, layout.qHyperCube.qNoOfLeftDims);
      setBatchedState({
        matrix,
        area: pivotPage.qArea,
        loading: false
      });
      // console.log('POST-onEndReached', matrix, pivotPage);
    } catch (error) {
      console.log('ERROR', error);
      setLoading(false);
    }
  }, [qArea, model, layout]);

  const onItemsRendered = ({
    visibleColumnStopIndex,
    visibleRowStopIndex
  }: OnItemsRenderedProps) => {
    if (visibleRowStopIndex >= data.matrix[0].length - 1 && data.matrix[0].length < layout.qHyperCube.qSize.qcy) {
      onReachedEndHandler(true);
    } else if (visibleColumnStopIndex >= data.matrix.length - 1 && data.matrix.length < layout.qHyperCube.qSize.qcx) {
      onReachedEndHandler(false);
    }
  };

  return (
    <VariableSizeGrid
      outerRef={innerRef}
      columnCount={data.matrix.length}
      columnWidth={(index) => index === 0 ? 250 : 100}
      height={rect.height}
      rowCount={data.matrix.length > 0 ? data.matrix[0].length : 0}
      rowHeight={() => 50}
      width={rect.width}
      itemData={data}
      onItemsRendered={onItemsRendered}
    >
      {GridCell}
    </VariableSizeGrid>
  );
}

