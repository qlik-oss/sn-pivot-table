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
    verticalScrollbarWidth,
    horizontalScrollbarHeight,
  } = useScroll({ layoutService, pageInfo });

  console.log({ verticalScrollbarWidth, horizontalScrollbarHeight });

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
    containerHeight,
    topGridHeight,
    leftGridHeight,
    dataGridHeight,
    showLastBottomBorder,
    isEmptySpaceExistsBelowLastRow,
  } = useGridHeight({
    pageInfo,
    headersData,
    topDimensionData,
    tableRect,
  });

  const {
    leftGridWidth,
    leftGridColumnWidths,
    rightGridWidth,
    totalWidth,
    showLastRightBorder,
    getRightGridColumnWidth,
    getHeaderCellsIconsVisibilityStatus,
  } = useColumnWidth(
    layoutService,
    tableRect,
    visibleLeftDimensionInfo,
    visibleTopDimensionInfo,
    verticalScrollbarWidth,
    isEmptySpaceExistsBelowLastRow,
  );

  const headerCellRowHightCallback = useCallback(() => headerCellHeight, [headerCellHeight]);
  const contentCellRowHightCallback = useCallback(() => contentCellHeight, [contentCellHeight]);

  return (
    <ScrollableContainer
      ref={verticalScrollableContainerRef}
      width={tableRect.width}
      height={tableRect.height}
      onScroll={onVerticalScrollHandler}
      showVerticalScrollbar
      showHorizontalScrollbar={false}
      origin="containerGrid"
    >
      <FullSizeContainer
        width={totalWidth - verticalScrollbarWidth}
        height={containerHeight + horizontalScrollbarHeight}
      >
        <StickyContainer
          width={tableRect.width - verticalScrollbarWidth}
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
              height={isEmptySpaceExistsBelowLastRow ? topGridHeight + dataGridHeight + GRID_BORDER : tableRect.height}
              onScroll={onHorizontalScrollHandler}
              showVerticalScrollbar={false}
              showHorizontalScrollbar
              origin="leftGrid"
            >
              <FullSizeContainer width={leftGridWidth} height={containerHeight - horizontalScrollbarHeight}>
                <StickyContainer width={leftGridWidth} height={tableRect.height - horizontalScrollbarHeight}>
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
                      height={leftGridHeight - horizontalScrollbarHeight}
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
            width={rightGridWidth + GRID_BORDER - verticalScrollbarWidth}
            height={
              isEmptySpaceExistsBelowLastRow
                ? topGridHeight + dataGridHeight + GRID_BORDER
                : tableRect.height - horizontalScrollbarHeight
            }
            onScroll={onHorizontalScrollHandler}
            showVerticalScrollbar={false}
            showHorizontalScrollbar
            origin="dataGrid"
          >
            <FullSizeContainer
              width={totalWidth - leftGridWidth - verticalScrollbarWidth}
              height={containerHeight - horizontalScrollbarHeight}
            >
              <StickyContainer
                width={tableRect.width - leftGridWidth - verticalScrollbarWidth}
                height={tableRect.height - horizontalScrollbarHeight}
              >
                <div style={{ width: rightGridWidth + GRID_BORDER - verticalScrollbarWidth }}>
                  <TopGrid
                    dataModel={dataModel}
                    topGridRef={topGridRef}
                    rowHightCallback={headerCellRowHightCallback}
                    width={rightGridWidth - verticalScrollbarWidth}
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
                    width={rightGridWidth - verticalScrollbarWidth}
                    height={dataGridHeight - horizontalScrollbarHeight}
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
