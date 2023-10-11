import type { stardust } from "@nebula.js/stardust";
import React, { useCallback } from "react";
import type { Model } from "../../types/QIX";
import type { LayoutService, PageInfo, Rect, ViewService } from "../../types/types";
import { GRID_BORDER } from "../constants";
import { useStyleContext } from "../contexts/StyleProvider";
import useColumnWidth from "../hooks/use-column-width";
import useData from "../hooks/use-data";
import useDataModel from "../hooks/use-data-model";
import useGridHeight from "../hooks/use-grid-height";
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
import { getLeftGridStyles } from "./shared-styles";

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

  const {
    getScrollLeft,
    getScrollTop,
    onHorizontalScrollHandler,
    onVerticalScrollHandler,
    verticalScrollableContainerRef,
    horizontalScrollableContainerRef,
    dataGridRef,
    leftGridRef,
    topGridRef,
  } = useScroll({ layoutService, pageInfo });

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
    leftGridColumnWidths,
    rightGridWidth,
    totalWidth,
    showLastRightBorder,
    getRightGridColumnWidth,
    getHeaderCellsIconsVisibilityStatus,
  } = useColumnWidth(layoutService, tableRect, visibleLeftDimensionInfo, visibleTopDimensionInfo);

  const { containerHeight, topGridHeight, leftGridHeight, dataGridHeight, showLastBottomBorder } = useGridHeight({
    pageInfo,
    headersData,
    topDimensionData,
    tableRect,
  });

  const headerCellRowHightCallback = useCallback(() => headerCellHeight, [headerCellHeight]);
  const contentCellRowHightCallback = useCallback(() => contentCellHeight, [contentCellHeight]);

  return (
    <ScrollableContainer
      ref={verticalScrollableContainerRef}
      width={tableRect.width}
      height={tableRect.height}
      onScroll={onVerticalScrollHandler}
      showVerticalScrollbar={true}
      showHorizontalScrollbar={false}
      origin="containerGrid"
    >
      <FullSizeContainer width={totalWidth} height={containerHeight}>
        <StickyContainer
          width={tableRect.width}
          height={tableRect.height}
          style={{
            display: "grid",
            gridTemplateColumns: leftGridWidth // If leftColumnsWidth is 0, this means no data exist for "headers" or "left"
              ? `${leftGridWidth}px ${rightGridWidth}px`
              : `${rightGridWidth}px`,
          }}
        >
          {Boolean(leftGridWidth) && (
            <ScrollableContainer
              ref={horizontalScrollableContainerRef}
              width={leftGridWidth}
              height={tableRect.height}
              onScroll={onHorizontalScrollHandler}
              showVerticalScrollbar={false}
              showHorizontalScrollbar={true}
              origin="leftGrid"
            >
              <FullSizeContainer width={leftGridWidth} height={containerHeight}>
                <StickyContainer width={leftGridWidth} height={tableRect.height}>
                  <div style={getLeftGridStyles(leftGridWidth)}>
                    <HeaderGrid
                      columnWidths={leftGridColumnWidths}
                      getHeaderCellsIconsVisibilityStatus={getHeaderCellsIconsVisibilityStatus}
                      rowHight={headerCellHeight}
                      height={topGridHeight}
                      headersData={headersData}
                      translator={translator}
                      changeSortOrder={changeSortOrder}
                      changeActivelySortedHeader={changeActivelySortedHeader}
                    />

                    <LeftGrid
                      dataModel={dataModel}
                      leftGridRef={leftGridRef}
                      width={leftGridWidth}
                      height={leftGridHeight}
                      columnWidths={leftGridColumnWidths}
                      getScrollTop={getScrollTop}
                      layoutService={layoutService}
                      leftDimensionData={leftDimensionData}
                      showLastBorder={{ right: false, bottom: showLastBottomBorder }}
                      visibleLeftDimensionInfo={visibleLeftDimensionInfo}
                      pageInfo={pageInfo}
                    />
                  </div>
                </StickyContainer>
              </FullSizeContainer>
            </ScrollableContainer>
          )}

          <ScrollableContainer
            ref={horizontalScrollableContainerRef}
            width={rightGridWidth + GRID_BORDER}
            height={tableRect.height}
            onScroll={onHorizontalScrollHandler}
            showVerticalScrollbar={false}
            showHorizontalScrollbar={true}
            origin="dataGrid"
          >
            <FullSizeContainer width={totalWidth - leftGridWidth} height={containerHeight}>
              <StickyContainer width={tableRect.width - leftGridWidth} height={tableRect.height}>
                <div style={{ width: rightGridWidth + GRID_BORDER }}>
                  <TopGrid
                    dataModel={dataModel}
                    topGridRef={topGridRef}
                    rowHightCallback={headerCellRowHightCallback}
                    width={rightGridWidth}
                    height={topGridHeight}
                    getScrollLeft={getScrollLeft}
                    layoutService={layoutService}
                    topDimensionData={topDimensionData}
                    showLastBorder={{ right: showLastRightBorder, bottom: false }}
                    getRightGridColumnWidth={getRightGridColumnWidth}
                    visibleTopDimensionInfo={visibleTopDimensionInfo}
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
                    showLastBorder={{ right: showLastRightBorder, bottom: showLastBottomBorder }}
                    getRightGridColumnWidth={getRightGridColumnWidth}
                  />
                </div>
              </StickyContainer>
            </FullSizeContainer>
          </ScrollableContainer>
        </StickyContainer>
      </FullSizeContainer>
    </ScrollableContainer>
  );
};
