/*  eslint-disable no-param-reassign */
import { useOnPropsChange } from "@qlik/nebula-table-utils/lib/hooks";
import { throttler } from "qlik-chart-modules";
import React, { memo, useCallback, useLayoutEffect } from "react";
import { VariableSizeGrid, type GridOnItemsRenderedProps } from "react-window";
import type {
  DataModel,
  GridItemData,
  LayoutService,
  LeftDimensionData,
  MeasureData,
  ShowLastBorder,
  TopDimensionData,
  ViewService,
} from "../../../types/types";
import { useStyleContext } from "../../contexts/StyleProvider";
import {
  useIsTotalValue,
  useShouldShowTotalCellBottomDivider,
  useShouldShowTotalCellRightDivider,
} from "../../hooks/use-is-total-cell";
import MemoizedDataCell from "../cells/DataCell";
import { borderStyle } from "../shared-styles";

interface DataGridProps {
  dataModel: DataModel;
  dataGridRef: React.RefObject<VariableSizeGrid>;
  height: number;
  rowHightCallback: () => number;
  width: number;
  viewService: ViewService;
  layoutService: LayoutService;
  measureData: MeasureData;
  topDimensionData: TopDimensionData;
  leftDimensionData: LeftDimensionData;
  showLastBorder: ShowLastBorder;
  getRightGridColumnWidth: (index?: number) => number;
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
  ...borderStyle,
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
  height,
  rowHightCallback,
  width,
  viewService,
  layoutService,
  measureData,
  leftDimensionData,
  topDimensionData,
  showLastBorder,
  getRightGridColumnWidth,
}: DataGridProps): JSX.Element | null => {
  const {
    grid: { divider },
    contentCellHeight,
  } = useStyleContext();
  const resolvedGridStyle = {
    ...(layoutService.hasLeftDimensions ? gridStyleWithLeftDimensions : gridStyleWithoutLeftDimensions),
    borderColor: divider,
    willChange: "auto",
  };

  const shouldShowTotalCellBottomDivider = useShouldShowTotalCellBottomDivider(leftDimensionData);

  const shouldShowTotalCellRightDivider = useShouldShowTotalCellRightDivider(topDimensionData);

  const isTotalValue = useIsTotalValue(leftDimensionData, topDimensionData);

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

  if (layoutService.size.x === 0) {
    return null;
  }

  return (
    <VariableSizeGrid
      ref={dataGridRef}
      style={resolvedGridStyle}
      columnCount={layoutService.size.x}
      columnWidth={getRightGridColumnWidth}
      height={height}
      rowCount={layoutService.size.y}
      rowHeight={rowHightCallback}
      width={width}
      itemData={
        {
          layoutService,
          grid: measureData,
          dataModel,
          showLastBorder,
          isTotalValue,
          shouldShowTotalCellBottomDivider,
          shouldShowTotalCellRightDivider,
        } as GridItemData
      }
      onItemsRendered={onItemsRendered}
      estimatedRowHeight={rowHightCallback()}
      estimatedColumnWidth={getRightGridColumnWidth()}
    >
      {MemoizedDataCell}
    </VariableSizeGrid>
  );
};

export default memo(DataGrid);
