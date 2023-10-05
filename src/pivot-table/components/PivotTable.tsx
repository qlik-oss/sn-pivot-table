import type { stardust } from "@nebula.js/stardust";
import React, { useCallback } from "react";
import type { Model } from "../../types/QIX";
import type { LayoutService, PageInfo, Rect, ViewService } from "../../types/types";
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
import { StyledLeftGrid, StyledRightGrid } from "./shared-styles";

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
    <ScrollableContainer ref={scrollableContainerRef} rect={tableRect} onScroll={onScrollHandler}>
      <FullSizeContainer width={totalWidth} height={containerHeight}>
        <StickyContainer rect={tableRect} leftColumnsWidth={leftGridWidth} rightColumnsWidth={rightGridWidth}>
          {Boolean(leftGridWidth) && (
            <StyledLeftGrid leftGridWidth={leftGridWidth}>
              <HeaderGrid
                columnWidthCallback={getLeftGridColumnWidth}
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
                getScrollTop={getScrollTop}
                layoutService={layoutService}
                leftDimensionData={leftDimensionData}
                showLastBorder={{ right: false, bottom: showLastBottomBorder }}
                getLeftGridColumnWidth={getLeftGridColumnWidth}
                visibleLeftDimensionInfo={visibleLeftDimensionInfo}
                pageInfo={pageInfo}
              />
            </StyledLeftGrid>
          )}

          <StyledRightGrid rightGridWidth={rightGridWidth}>
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
          </StyledRightGrid>
        </StickyContainer>
      </FullSizeContainer>
    </ScrollableContainer>
  );
};
