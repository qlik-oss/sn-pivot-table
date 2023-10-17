import type { stardust } from "@nebula.js/stardust";
import React, { useCallback } from "react";
import type { Model } from "../../types/QIX";
import {
  ScrollableContainerOrigin,
  type LayoutService,
  type PageInfo,
  type Rect,
  type ViewService,
} from "../../types/types";
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
    layoutService,
  });

  const { containerHeight, topGridHeight, leftGridHeight, dataGridHeight, allRowsVisible } = useGridHeight({
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
  } = useColumnWidth(layoutService, tableRect, visibleLeftDimensionInfo, visibleTopDimensionInfo);

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
      origin={ScrollableContainerOrigin.CONTAINER_GRID}
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
              height={allRowsVisible ? topGridHeight + dataGridHeight + GRID_BORDER : tableRect.height}
              onScroll={onHorizontalScrollHandler}
              showVerticalScrollbar={false}
              showHorizontalScrollbar
              origin={ScrollableContainerOrigin.LEFT_GRID}
            >
              <FullSizeContainer width={leftGridWidth} height={containerHeight}>
                <StickyContainer width={leftGridWidth} height={tableRect.height}>
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
                    showLastBorder={{ right: false, bottom: allRowsVisible }}
                    visibleLeftDimensionInfo={visibleLeftDimensionInfo}
                    pageInfo={pageInfo}
                  />
                </StickyContainer>
              </FullSizeContainer>
            </ScrollableContainer>
          )}

          <ScrollableContainer
            ref={horizontalScrollableContainerRef}
            width={rightGridWidth + GRID_BORDER}
            height={allRowsVisible ? topGridHeight + dataGridHeight + GRID_BORDER : tableRect.height}
            onScroll={onHorizontalScrollHandler}
            showVerticalScrollbar={false}
            showHorizontalScrollbar
            origin={ScrollableContainerOrigin.DATA_GRID}
          >
            <FullSizeContainer width={totalWidth - leftGridWidth} height={containerHeight}>
              <StickyContainer width={tableRect.width - leftGridWidth} height={tableRect.height}>
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
                  showLastBorder={{ right: showLastRightBorder, bottom: allRowsVisible }}
                  getRightGridColumnWidth={getRightGridColumnWidth}
                />
              </StickyContainer>
            </FullSizeContainer>
          </ScrollableContainer>
        </StickyContainer>
      </FullSizeContainer>
    </ScrollableContainer>
  );
};
