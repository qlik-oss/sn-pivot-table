import { stardust } from "@nebula.js/stardust";
import React, { useCallback, useLayoutEffect, useRef } from "react";
import { VariableSizeGrid, VariableSizeList } from "react-window";
import { LayoutService, Rect, ViewService } from "../../types/types";
// import useDebug from '../hooks/use-debug';
import { Model } from "../../types/QIX";
import { useStyleContext } from "../contexts/StyleProvider";
import useColumnWidth from "../hooks/use-column-width";
import useData from "../hooks/use-data";
import useDataModel from "../hooks/use-data-model";
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
}

export const StickyPivotTable = ({
  model,
  rect,
  constraints,
  viewService,
  layoutService,
  qPivotDataPages,
}: PivotTableProps): JSX.Element => {
  const { qHyperCube, snapshotData } = layoutService.layout;
  const { headerCellHeight, contentCellHeight } = useStyleContext();
  const scrollableContainerRef = useRef<HTMLDivElement>(null);
  const topGridRef = useRef<VariableSizeList[]>([]);
  const leftGridRef = useRef<VariableSizeList[]>([]);
  const dataGridRef = useRef<VariableSizeGrid>(null);
  const currentScrollLeft = useRef<number>(0);
  const currentScrollTop = useRef<number>(0);

  const {
    headersData,
    measureData,
    topDimensionData,
    leftDimensionData,
    hasMoreRows,
    hasMoreColumns,
    nextPageHandler,
    moreDataHandler,
  } = useData(qPivotDataPages, qHyperCube, snapshotData);

  const dataModel = useDataModel({
    model,
    nextPageHandler,
    moreDataHandler,
    hasMoreRows,
    hasMoreColumns,
    size: measureData.size,
  });

  const { leftGridWidth, rightGridWidth, getLeftColumnWidth, getMeasureInfoWidth, getTotalWidth } = useColumnWidth(
    layoutService,
    rect,
    leftDimensionData,
    measureData
  );

  useLayoutEffect(() => {
    if (!layoutService.layout.qHyperCube.qLastExpandedPos) {
      if (scrollableContainerRef.current) {
        scrollableContainerRef.current.scrollLeft = 0;
        scrollableContainerRef.current.scrollTop = 0;
      }
    }
  }, [layoutService]);

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

  // useDebug('PivotTable', {
  //   model,
  //   rect,
  //   constraints,
  //   viewService,
  //   layoutService,
  //   qPivotDataPages,
  //   dataModel,
  //   headersData,
  //   measureData,
  //   topDimensionData,
  //   leftDimensionData,
  //   hasMoreRows,
  //   hasMoreColumns,
  //   nextPageHandler,
  //   moreDataHandler
  // });

  const headerGridHeight = headerCellHeight * headersData.size.y;
  const leftGridHeight = rect.height - headerGridHeight;
  // console.log({ rect, headerGridHeight, headerCellHeight, leftGridHeight, headersData });
  // Top grid should always have height to support cases when there is no top data but it need to occupy space to currecly render headers
  const topGridHeight = headerCellHeight * Math.max(topDimensionData.size.y, 1);
  const dataGridHeight = rect.height - topGridHeight;

  return (
    <ScrollableContainer ref={scrollableContainerRef} rect={rect} onScroll={onScrollHandler} constraints={constraints}>
      <FullSizeContainer
        width={getTotalWidth()}
        height={headerCellHeight * (measureData.size.y + topDimensionData.size.y)}
      >
        <StickyContainer
          rect={rect}
          leftColumnsWidth={leftGridWidth}
          rightColumnsWidth={rightGridWidth}
          topRowsHeight={topGridHeight}
          bottomRowsHeight={dataGridHeight}
        >
          {/* GOLD ONE */}
          <HeaderGrid
            columnWidthCallback={getLeftColumnWidth}
            rowHightCallback={headerCellRowHightCallback}
            width={leftGridWidth}
            height={headerGridHeight}
            headersData={headersData}
          />

          {/* BISQUE ONE */}
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

          {/* BISQUE ONE */}
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
            hasMoreRows={hasMoreRows}
            hasMoreColumns={hasMoreColumns}
          />
        </StickyContainer>
      </FullSizeContainer>
    </ScrollableContainer>
  );
};
