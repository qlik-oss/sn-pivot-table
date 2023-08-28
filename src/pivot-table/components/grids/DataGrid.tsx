/*  eslint-disable no-param-reassign */
import { useOnPropsChange } from "@qlik/nebula-table-utils/lib/hooks";
import { throttler } from "qlik-chart-modules";
import React, { memo, useCallback, useLayoutEffect, useMemo } from "react";
import { VariableSizeGrid, type GridOnItemsRenderedProps } from "react-window";
import type {
  DataModel,
  GridItemData,
  IsTotalCellAt,
  LayoutService,
  MeasureData,
  ViewService,
} from "../../../types/types";
import { useStyleContext } from "../../contexts/StyleProvider";
import MemoizedDataCell from "../cells/DataCell";
import { gridBorderStyle } from "../shared-styles";

interface DataGridProps {
  dataModel: DataModel;
  dataGridRef: React.RefObject<VariableSizeGrid>;
  getMeasureInfoWidth: (index: number) => number;
  height: number;
  rowHightCallback: () => number;
  width: number;
  viewService: ViewService;
  layoutService: LayoutService;
  measureData: MeasureData;
  showLastRowBorderBottom: boolean;
  isTotalCellAt: IsTotalCellAt;
}

type FetchModeData = (
  dataModel: DataModel,
  measureData: MeasureData,
  overscanColumnStartIndex: number,
  overscanColumnStopIndex: number,
  overscanRowStartIndex: number,
  overscanRowStopIndex: number,
) => Promise<void>;

const gridStyle: React.CSSProperties = {
  ...gridBorderStyle,
  overflow: "hidden",
  boxSizing: "content-box",
};

const gridStyleWithLeftDimensions: React.CSSProperties = {
  ...gridStyle,
  borderWidth: "1px 0px 0px 1px",
};

const gridStyleWithoutLeftDimensions: React.CSSProperties = {
  ...gridStyle,
  borderWidth: "1px 0px 0px 0px",
};

const isMissingData = (
  data: MeasureData,
  visibleColumnStartIndex: number,
  visibleColumnStopIndex: number,
  visibleRowStartIndex: number,
  visibleRowStopIndex: number,
) => {
  for (let rowIndex = visibleRowStartIndex; rowIndex <= visibleRowStopIndex; rowIndex++) {
    for (let colIndex = visibleColumnStartIndex; colIndex <= visibleColumnStopIndex; colIndex++) {
      if (!data[rowIndex]?.[colIndex]) {
        return true;
      }
    }
  }

  return false;
};

const throttledFetchMoreData: FetchModeData = throttler(
  async (
    dataModel: DataModel,
    measureData: MeasureData,
    overscanColumnStartIndex: number,
    overscanColumnStopIndex: number,
    overscanRowStartIndex: number,
    overscanRowStopIndex: number,
  ) => {
    const shouldFetchData = isMissingData(
      measureData,
      overscanColumnStartIndex,
      overscanColumnStopIndex,
      overscanRowStartIndex,
      overscanRowStopIndex,
    );

    if (shouldFetchData) {
      await dataModel.fetchMoreData(
        overscanColumnStartIndex,
        overscanRowStartIndex,
        overscanColumnStopIndex - overscanColumnStartIndex + 1,
        overscanRowStopIndex - overscanRowStartIndex + 1,
      );
    }
  },
  100,
);

const DataGrid = ({
  dataModel,
  dataGridRef,
  getMeasureInfoWidth,
  height,
  rowHightCallback,
  width,
  viewService,
  layoutService,
  measureData,
  showLastRowBorderBottom,
  isTotalCellAt,
}: DataGridProps): JSX.Element | null => {
  const {
    grid: { divider },
    contentCellHeight,
  } = useStyleContext();
  const { qMeasureInfo } = layoutService.layout.qHyperCube;
  const resolvedGridStyle = {
    ...(layoutService.hasLeftDimensions ? gridStyleWithLeftDimensions : gridStyleWithoutLeftDimensions),
    borderColor: divider,
    willChange: "auto",
  };

  useOnPropsChange(() => {
    if (dataGridRef.current) {
      dataGridRef.current.resetAfterColumnIndex(0, false); // Needs to be re-computed every time the data changes
    }
  }, [dataGridRef, dataModel, measureData]);

  useLayoutEffect(() => {
    if (dataGridRef.current) {
      dataGridRef.current.resetAfterIndices({ columnIndex: 0, rowIndex: 0, shouldForceUpdate: true });
    }
  }, [width, height, dataGridRef, contentCellHeight]);

  const onItemsRendered = useCallback(
    async ({
      overscanColumnStartIndex,
      overscanColumnStopIndex,
      overscanRowStartIndex,
      overscanRowStopIndex,
      visibleColumnStartIndex,
    }: GridOnItemsRenderedProps) => {
      viewService.gridColumnStartIndex = visibleColumnStartIndex;
      viewService.gridRowStartIndex = overscanRowStartIndex;
      viewService.gridWidth = overscanColumnStopIndex - overscanColumnStartIndex + 1;
      viewService.gridHeight = overscanRowStopIndex - overscanRowStartIndex + 1;

      await throttledFetchMoreData(
        dataModel,
        measureData,
        overscanColumnStartIndex,
        overscanColumnStopIndex,
        overscanRowStartIndex,
        overscanRowStopIndex,
      );
    },
    [viewService, dataModel, measureData],
  );

  const getColumnWidth = useCallback(
    (index: number) => getMeasureInfoWidth(layoutService.getMeasureInfoIndexFromCellIndex(index)),
    [getMeasureInfoWidth, layoutService],
  );

  const allMeasuresWidth = useMemo(
    () => qMeasureInfo.reduce((totalWidth, measure, index) => totalWidth + getMeasureInfoWidth(index), 0),
    [getMeasureInfoWidth, qMeasureInfo],
  );

  if (layoutService.size.x === 0) {
    return null;
  }

  return (
    <VariableSizeGrid
      ref={dataGridRef}
      style={resolvedGridStyle}
      columnCount={layoutService.size.x}
      columnWidth={getColumnWidth}
      height={height}
      rowCount={layoutService.size.y}
      rowHeight={rowHightCallback}
      width={width}
      itemData={
        {
          layoutService,
          grid: measureData,
          dataModel,
          showLastRowBorderBottom,
          isTotalCellAt,
        } as GridItemData
      }
      onItemsRendered={onItemsRendered}
      estimatedRowHeight={rowHightCallback()}
      estimatedColumnWidth={allMeasuresWidth / qMeasureInfo.length}
    >
      {MemoizedDataCell}
    </VariableSizeGrid>
  );
};

export default memo(DataGrid);
