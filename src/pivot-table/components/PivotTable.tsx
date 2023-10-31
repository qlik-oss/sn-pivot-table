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
import getScrollableAreasDimensions from "./helpers/get-scrollable-areas-dimensions";

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
  const { visibleLeftDimensionInfo, visibleTopDimensionInfo } = useVisibleDimensions(layoutService, qPivotDataPages);
  const { changeSortOrder, changeActivelySortedHeader } = useSorting(model, layoutService.layout.qHyperCube);

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
    onHorizontalScrollHandler,
    onVerticalScrollHandler,
    verticalScrollableContainerRef,
    leftGridHorizontalScrollableContainerRef,
    dataGridHorizontalScrollableContainerRef,
    dataGridRef,
    leftGridRef,
    topGridRef,
    verticalScrollbarWidth,
    horizontalScrollbarHeight,
    horizontalScrollbarHeightSetter,
  } = useScroll({ layoutService, pageInfo });

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
    headersData,
    visibleTopDimensionInfo,
    verticalScrollbarWidth,
    horizontalScrollbarHeightSetter,
  );

  const { rootWrapper, leftWrapper, rightWrapper } = getScrollableAreasDimensions({
    tableRect,

    containerHeight,
    leftGridHeight,
    topGridHeight,
    dataGridHeight,
    allRowsVisible,

    totalWidth,
    leftGridWidth,
    rightGridWidth,
    verticalScrollbarWidth,
    horizontalScrollbarHeight,
  });

  const headerCellRowHightCallback = useCallback(() => headerCellHeight, [headerCellHeight]);
  const contentCellRowHightCallback = useCallback(() => contentCellHeight, [contentCellHeight]);

  return (
    <ScrollableContainer
      ref={verticalScrollableContainerRef}
      {...rootWrapper.scrollable}
      onScroll={onVerticalScrollHandler}
      showVerticalScrollbar
      showHorizontalScrollbar={false}
      origin={ScrollableContainerOrigin.CONTAINER_GRID}
    >
      <FullSizeContainer {...rootWrapper.fullSize}>
        <StickyContainer
          {...rootWrapper.sticky}
          style={{
            display: "grid",
            gridTemplateColumns: leftGridWidth // If leftColumnsWidth is 0, this means no data exist for "headers" or "left"
              ? `${leftGridWidth}px ${rightGridWidth - verticalScrollbarWidth}px`
              : `${rightGridWidth - verticalScrollbarWidth}px`,
          }}
        >
          {Boolean(leftGridWidth) && (
            <ScrollableContainer
              ref={leftGridHorizontalScrollableContainerRef}
              {...leftWrapper.containers.scrollable}
              onScroll={onHorizontalScrollHandler}
              showVerticalScrollbar={false}
              showHorizontalScrollbar
              origin={ScrollableContainerOrigin.LEFT_GRID}
            >
              <FullSizeContainer {...leftWrapper.containers.fullSize}>
                <StickyContainer {...leftWrapper.containers.sticky}>
                  <HeaderGrid
                    dataModel={dataModel}
                    columnWidths={leftGridColumnWidths}
                    getHeaderCellsIconsVisibilityStatus={getHeaderCellsIconsVisibilityStatus}
                    rowHight={headerCellHeight}
                    height={leftWrapper.headerGrid.height}
                    headersData={headersData}
                    translator={translator}
                    changeSortOrder={changeSortOrder}
                    changeActivelySortedHeader={changeActivelySortedHeader}
                  />

                  <LeftGrid
                    dataModel={dataModel}
                    leftGridRef={leftGridRef}
                    {...leftWrapper.leftGrid}
                    columnWidths={leftGridColumnWidths}
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
            ref={dataGridHorizontalScrollableContainerRef}
            {...rightWrapper.containers.scrollable}
            onScroll={onHorizontalScrollHandler}
            showVerticalScrollbar={false}
            showHorizontalScrollbar
            origin={ScrollableContainerOrigin.DATA_GRID}
          >
            <FullSizeContainer {...rightWrapper.containers.fullSize}>
              <StickyContainer {...rightWrapper.containers.sticky}>
                <TopGrid
                  dataModel={dataModel}
                  topGridRef={topGridRef}
                  rowHightCallback={headerCellRowHightCallback}
                  {...rightWrapper.topGrid}
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
                  {...rightWrapper.dataGrid}
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
