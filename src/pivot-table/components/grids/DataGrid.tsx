/*  eslint-disable no-param-reassign */
import { useOnPropsChange } from "@qlik/nebula-table-utils/lib/hooks";
import React, { memo, useLayoutEffect } from "react";
import { VariableSizeGrid } from "react-window";
import type {
  AttrExprInfoIndex,
  DataModel,
  GridItemData,
  LayoutService,
  LeftDimensionData,
  MeasureData,
  PageInfo,
  ScrollDirection,
  ShowLastBorder,
  TopDimensionData,
  ViewService,
  VisibleDimensionInfo,
} from "../../../types/types";
import { useStyleContext } from "../../contexts/StyleProvider";
import {
  useIsTotalValue,
  useShouldShowTotalCellBottomDivider,
  useShouldShowTotalCellRightDivider,
} from "../../hooks/use-is-total-cell";
import useItemsRenderedHandler from "../../hooks/use-items-rendered-handler";
import MemoizedDataCell from "../cells/DataCell";
import { getGridItemKey } from "../helpers/get-item-key";
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
  visibleTopDimensionInfo: VisibleDimensionInfo[];
  visibleLeftDimensionInfo: VisibleDimensionInfo[];
  attrExprInfoIndexes: AttrExprInfoIndex[];
  showLastBorder: ShowLastBorder;
  getRightGridColumnWidth: (index?: number) => number;
  pageInfo: PageInfo;
  verticalScrollDirection: React.MutableRefObject<ScrollDirection>;
  horizontalScrollDirection: React.MutableRefObject<ScrollDirection>;
}

const gridStyle: React.CSSProperties = {
  ...borderStyle,
  overflow: "hidden",
  boxSizing: "content-box",
  borderWidth: "1px 0px 0px 1px",
};

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
  visibleTopDimensionInfo,
  visibleLeftDimensionInfo,
  attrExprInfoIndexes,
  showLastBorder,
  getRightGridColumnWidth,
  pageInfo,
  verticalScrollDirection,
  horizontalScrollDirection,
}: DataGridProps): JSX.Element | null => {
  const {
    grid: { divider },
    contentCellHeight,
  } = useStyleContext();
  const resolvedGridStyle: React.CSSProperties = {
    ...gridStyle,
    borderColor: divider,
    willChange: "auto",
    userSelect: "none",
    WebkitUserSelect: "none",
  };

  const shouldShowTotalCellBottomDivider = useShouldShowTotalCellBottomDivider(leftDimensionData);

  const shouldShowTotalCellRightDivider = useShouldShowTotalCellRightDivider(topDimensionData);

  const isTotalValue = useIsTotalValue(leftDimensionData, topDimensionData);

  const onItemsRenderedHandler = useItemsRenderedHandler({
    viewService,
    layoutService,
    dataModel,
    measureData,
    pageInfo,
    leftColumnCount: leftDimensionData.columnCount,
    topRowCount: topDimensionData.rowCount,
    verticalScrollDirection,
    horizontalScrollDirection,
  });

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
      rowCount={pageInfo.rowsOnCurrentPage}
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
          pageInfo,
          lastRow: topDimensionData.grid.at(visibleTopDimensionInfo.length - 1),
          lastColumn: leftDimensionData.grid.at(visibleLeftDimensionInfo.length - 1),
          attrExprInfoIndexes,
        } as GridItemData
      }
      onItemsRendered={onItemsRenderedHandler}
      estimatedRowHeight={rowHightCallback()}
      estimatedColumnWidth={getRightGridColumnWidth()}
      itemKey={getGridItemKey}
    >
      {MemoizedDataCell}
    </VariableSizeGrid>
  );
};

export default memo(DataGrid);
