import type { stardust } from "@nebula.js/stardust";
import React, { useCallback } from "react";
import type { Model } from "../../types/QIX";
import type { LayoutService, PageInfo, Rect, ViewService } from "../../types/types";
import { GRID_BORDER } from "../constants";
import { useStyleContext } from "../contexts/StyleProvider";
import useColumnWidth from "../hooks/use-column-width";
import useData from "../hooks/use-data";
import useDataModel from "../hooks/use-data-model";
import useScroll from "../hooks/use-scroll";
import useSorting from "../hooks/use-sorting";
import useTableRect from "../hooks/use-table-rect";
import useVisibleDimensions from "../hooks/use-visible-dimensions";
import FullSizeContainer from "./containers/FullSizeContainer";
import ScrollableContainer from "./containers/ScrollableContainer";
import StickyContainer from "./containers/StickyContainer";
import DataGrid from "./grids/DataGrid";
import HeaderGrid from "./grids/HeaderGrid";
import LeftGrid from "./grids/LeftGrid";
import TopGrid from "./grids/TopGrid";

export interface PivotTableProps {
  rect: Rect;
  viewService: ViewService;
  layoutService: LayoutService;
  qPivotDataPages: EngineAPI.INxPivotPage[];
  model: Model;
  pageInfo: PageInfo;
  translator: stardust.Translator;
}

export const StickyPivotTable = ({
  model,
  rect,
  viewService,
  layoutService,
  qPivotDataPages,
  pageInfo,
  translator,
}: PivotTableProps): JSX.Element => {
  const { headerCellHeight, contentCellHeight } = useStyleContext();
  const tableRect = useTableRect(rect, layoutService, pageInfo.shouldShowPagination);
  const { changeSortOrder, changeActivelySortedHeader } = useSorting(model, layoutService.layout.qHyperCube);
  const { visibleLeftDimensionInfo, visibleTopDimensionInfo } = useVisibleDimensions(layoutService, qPivotDataPages);

  const { getScrollLeft, getScrollTop, onScrollHandler, scrollableContainerRef, dataGridRef, leftGridRef, topGridRef } =
    useScroll({ layoutService, pageInfo });

  const { headersData, measureData, topDimensionData, leftDimensionData, nextPageHandler } = useData(
    qPivotDataPages,
    layoutService,
    pageInfo,
    visibleLeftDimensionInfo,
    visibleTopDimensionInfo,
  );

  const dataModel = useDataModel({
    model,
    nextPageHandler,
    pageInfo,
  });

  const {
    leftGridWidth,
    rightGridWidth,
    totalWidth,
    showLastRightBorder,
    getLeftGridColumnWidth,
    getRightGridColumnWidth,
  } = useColumnWidth(layoutService, tableRect, visibleLeftDimensionInfo, visibleTopDimensionInfo);

  const headerCellRowHightCallback = useCallback(() => headerCellHeight, [headerCellHeight]);
  const contentCellRowHightCallback = useCallback(() => contentCellHeight, [contentCellHeight]);

  const totalDataHeight = pageInfo.rowsOnCurrentPage * contentCellHeight;
  const headerGridHeight = headerCellHeight * headersData.size.y;
  const containerHeight = totalDataHeight + headerGridHeight;

  // Top grid should always have height to support cases when there is no top data but it need to occupy space to correctly render headers
  const topGridHeight = headerCellHeight * Math.max(topDimensionData.rowCount, 1);
  const leftGridHeight = Math.min(tableRect.height - headerGridHeight - GRID_BORDER, totalDataHeight);
  const dataGridHeight = Math.min(tableRect.height - topGridHeight - GRID_BORDER, totalDataHeight);

  const rowsCanFitInTableViewPort = Math.floor(tableRect.height / contentCellHeight);
  const rowsInCurrentPage = Object.values(Object.values(leftDimensionData.grid).at(-1) || {}).length;
  const showLastBottomBorder = rowsInCurrentPage < rowsCanFitInTableViewPort;
  const showLastBorder = { right: showLastRightBorder, bottom: showLastBottomBorder };

  return (
    <ScrollableContainer ref={scrollableContainerRef} rect={tableRect} onScroll={onScrollHandler}>
      <FullSizeContainer width={totalWidth} height={containerHeight}>
        <StickyContainer
          rect={tableRect}
          leftColumnsWidth={leftGridWidth}
          rightColumnsWidth={rightGridWidth}
          topRowsHeight={topGridHeight}
          bottomRowsHeight={dataGridHeight}
        >
          <HeaderGrid
            columnWidthCallback={getLeftGridColumnWidth}
            rowHight={headerCellHeight}
            headersData={headersData}
            translator={translator}
            changeSortOrder={changeSortOrder}
            changeActivelySortedHeader={changeActivelySortedHeader}
          />

          <TopGrid
            dataModel={dataModel}
            topGridRef={topGridRef}
            rowHightCallback={headerCellRowHightCallback}
            width={rightGridWidth}
            height={topGridHeight}
            getScrollLeft={getScrollLeft}
            layoutService={layoutService}
            topDimensionData={topDimensionData}
            showLastBorder={{ ...showLastBorder, bottom: false }}
            getRightGridColumnWidth={getRightGridColumnWidth}
            visibleTopDimensionInfo={visibleTopDimensionInfo}
          />

          <LeftGrid
            dataModel={dataModel}
            leftGridRef={leftGridRef}
            width={leftGridWidth}
            height={leftGridHeight}
            getScrollTop={getScrollTop}
            layoutService={layoutService}
            leftDimensionData={leftDimensionData}
            showLastBorder={{ ...showLastBorder, right: false }}
            getLeftGridColumnWidth={getLeftGridColumnWidth}
            visibleLeftDimensionInfo={visibleLeftDimensionInfo}
            pageInfo={pageInfo}
          />

          <DataGrid
            dataModel={dataModel}
            dataGridRef={dataGridRef}
            rowHightCallback={contentCellRowHightCallback}
            width={rightGridWidth}
            height={dataGridHeight}
            viewService={viewService}
            layoutService={layoutService}
            measureData={measureData}
            leftDimensionData={leftDimensionData}
            topDimensionData={topDimensionData}
            showLastBorder={showLastBorder}
            getRightGridColumnWidth={getRightGridColumnWidth}
          />
        </StickyContainer>
      </FullSizeContainer>
    </ScrollableContainer>
  );
};
