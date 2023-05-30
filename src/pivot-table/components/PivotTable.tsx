import type { stardust } from "@nebula.js/stardust";
import React, { useCallback, useLayoutEffect, useRef } from "react";
import type { VariableSizeGrid, VariableSizeList } from "react-window";
import type { Model } from "../../types/QIX";
import type { LayoutService, PageInfo, Rect, ViewService } from "../../types/types";
import { GRID_BORDER } from "../constants";
import { useStyleContext } from "../contexts/StyleProvider";
import useColumnWidth from "../hooks/use-column-width";
import useData from "../hooks/use-data";
import useDataModel from "../hooks/use-data-model";
import useTableRect from "../hooks/use-table-rect";
import FullSizeContainer from "./containers/FullSizeContainer";
import ScrollableContainer from "./containers/ScrollableContainer";
import StickyContainer from "./containers/StickyContainer";
import DataGrid from "./grids/DataGrid";
import HeaderGrid from "./grids/HeaderGrid";
import LeftGrid from "./grids/LeftGrid";
import TopGrid from "./grids/TopGrid";

export interface PivotTableProps {
  rect: Rect;
  constraints: stardust.Constraints;
  viewService: ViewService;
  layoutService: LayoutService;
  qPivotDataPages: EngineAPI.INxPivotPage[];
  model: Model;
  pageInfo: PageInfo;
}

export const StickyPivotTable = ({
  model,
  rect,
  constraints,
  viewService,
  layoutService,
  qPivotDataPages,
  pageInfo,
}: PivotTableProps): JSX.Element => {
  const { headerCellHeight, contentCellHeight } = useStyleContext();
  const scrollableContainerRef = useRef<HTMLDivElement>(null);
  const topGridRef = useRef<VariableSizeList[]>([]);
  const leftGridRef = useRef<VariableSizeList[]>([]);
  const dataGridRef = useRef<VariableSizeGrid>(null);
  const currentScrollLeft = useRef<number>(0);
  const currentScrollTop = useRef<number>(0);
  const tableRect = useTableRect(rect, layoutService, pageInfo.shouldShowPagination);

  const { headersData, measureData, topDimensionData, leftDimensionData, nextPageHandler } = useData(
    qPivotDataPages,
    layoutService,
    pageInfo
  );

  const dataModel = useDataModel({
    model,
    nextPageHandler,
    pageInfo,
  });

  const { leftGridWidth, rightGridWidth, getLeftColumnWidth, getMeasureInfoWidth, getTotalWidth } = useColumnWidth(
    layoutService,
    tableRect,
    leftDimensionData
  );

  useLayoutEffect(() => {
    if (!layoutService.layout.qHyperCube.qLastExpandedPos) {
      if (scrollableContainerRef.current) {
        scrollableContainerRef.current.scrollLeft = 0;
        scrollableContainerRef.current.scrollTop = 0;
      }
    }
  }, [layoutService]);

  useLayoutEffect(() => {
    if (scrollableContainerRef.current) {
      scrollableContainerRef.current.scrollLeft = 0;
      scrollableContainerRef.current.scrollTop = 0;
    }
  }, [pageInfo.currentPage]);

  const onScrollHandler = (event: React.SyntheticEvent) => {
    if (topGridRef.current) {
      topGridRef.current.forEach((list) => list?.scrollTo(event.currentTarget.scrollLeft));
    }

    if (leftGridRef.current) {
      leftGridRef.current.forEach((list) => list?.scrollTo(event.currentTarget.scrollTop));
    }

    if (dataGridRef.current) {
      dataGridRef.current.scrollTo({
        scrollLeft: event.currentTarget.scrollLeft,
        scrollTop: event.currentTarget.scrollTop,
      });
    }

    if (typeof currentScrollLeft.current !== "undefined") {
      // Set scrollLeft here so that when a top grid is expanded with a new row, scroll that row to scrollLeft position.
      // Otherwise it will be out-of-sync with the other rows.
      currentScrollLeft.current = event.currentTarget.scrollLeft;
    }

    if (typeof currentScrollTop.current !== "undefined") {
      // Set scrollTop here so that when a left grid is expanded with a new column, scroll that row to scrollTop position.
      // Otherwise it will be out-of-sync with the other columns.
      currentScrollTop.current = event.currentTarget.scrollTop;
    }
  };

  const headerCellRowHightCallback = useCallback(() => headerCellHeight, [headerCellHeight]);
  const contentCellRowHightCallback = useCallback(() => contentCellHeight, [contentCellHeight]);
  const getScrollLeft = useCallback(() => currentScrollLeft.current, [currentScrollLeft]);
  const getScrollTop = useCallback(() => currentScrollTop.current, [currentScrollTop]);

  const dataRowCount = Math.min(
    layoutService.layout.qHyperCube.qSize.qcy - pageInfo.currentPage * pageInfo.rowsPerPage,
    pageInfo.rowsPerPage
  );

  const totalDataHeight = dataRowCount * contentCellHeight + GRID_BORDER;
  const containerHeight = totalDataHeight + headerCellHeight * topDimensionData.rowCount;
  const headerGridHeight = headerCellHeight * headersData.size.y;
  // Top grid should always have height to support cases when there is no top data but it need to occupy space to currecly render headers
  const topGridHeight = headerCellHeight * Math.max(topDimensionData.rowCount, 1);
  const leftGridHeight = Math.min(tableRect.height - headerGridHeight, totalDataHeight);
  const dataGridHeight = Math.min(tableRect.height - topGridHeight, totalDataHeight);

  return (
    <ScrollableContainer
      ref={scrollableContainerRef}
      rect={tableRect}
      onScroll={onScrollHandler}
      constraints={constraints}
    >
      <FullSizeContainer width={getTotalWidth()} height={containerHeight}>
        <StickyContainer
          rect={tableRect}
          leftColumnsWidth={leftGridWidth}
          rightColumnsWidth={rightGridWidth}
          topRowsHeight={topGridHeight}
          bottomRowsHeight={dataGridHeight}
        >
          <HeaderGrid columnWidthCallback={getLeftColumnWidth} rowHight={headerCellHeight} headersData={headersData} />

          <TopGrid
            dataModel={dataModel}
            constraints={constraints}
            topGridRef={topGridRef}
            getMeasureInfoWidth={getMeasureInfoWidth}
            rowHightCallback={headerCellRowHightCallback}
            width={rightGridWidth}
            height={topGridHeight}
            getScrollLeft={getScrollLeft}
            layoutService={layoutService}
            topDimensionData={topDimensionData}
          />

          <LeftGrid
            dataModel={dataModel}
            constraints={constraints}
            leftGridRef={leftGridRef}
            getLeftColumnWidth={getLeftColumnWidth}
            width={leftGridWidth}
            height={leftGridHeight}
            getScrollTop={getScrollTop}
            layoutService={layoutService}
            leftDimensionData={leftDimensionData}
          />

          <DataGrid
            dataModel={dataModel}
            dataGridRef={dataGridRef}
            getMeasureInfoWidth={getMeasureInfoWidth}
            rowHightCallback={contentCellRowHightCallback}
            width={rightGridWidth}
            height={dataGridHeight}
            viewService={viewService}
            layoutService={layoutService}
            measureData={measureData}
          />
        </StickyContainer>
      </FullSizeContainer>
    </ScrollableContainer>
  );
};
