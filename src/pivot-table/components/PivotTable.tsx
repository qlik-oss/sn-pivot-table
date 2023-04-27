import { stardust } from "@nebula.js/stardust";
import React, { useCallback, useLayoutEffect, useRef } from "react";
import { VariableSizeGrid, VariableSizeList } from "react-window";
import { Model } from "../../types/QIX";
import { LayoutService, Rect, ViewService } from "../../types/types";
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
  const { cellHeight } = useStyleContext();
  const scrollableContainerRef = useRef<HTMLDivElement>(null);
  const topGridRef = useRef<VariableSizeList[]>([]);
  const leftGridRef = useRef<VariableSizeList[]>([]);
  const dataGridRef = useRef<VariableSizeGrid>(null);
  const currentScrollLeft = useRef<number>(0);
  const currentScrollTop = useRef<number>(0);

  const { headersData, measureData, topDimensionData, leftDimensionData, nextPageHandler } = useData(
    qPivotDataPages,
    layoutService
  );

  const dataModel = useDataModel({
    model,
    nextPageHandler,
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

  const rowHightCallback = useCallback(() => cellHeight, [cellHeight]);
  const getScrollLeft = useCallback(() => currentScrollLeft.current, [currentScrollLeft]);
  const getScrollTop = useCallback(() => currentScrollTop.current, [currentScrollTop]);

  const headerGridHeight = cellHeight * headersData.size.y;
  const leftGridHeight = rect.height - headerGridHeight;
  // Top grid should always have height to support cases when there is no top data but it need to occupy space to currecly render headers
  const topGridHeight = cellHeight * Math.max(topDimensionData.size, 1);
  const dataGridHeight = rect.height - topGridHeight;

  return (
    <ScrollableContainer ref={scrollableContainerRef} rect={rect} onScroll={onScrollHandler} constraints={constraints}>
      <FullSizeContainer width={getTotalWidth()} height={cellHeight * (measureData.size.y + topDimensionData.size)}>
        <StickyContainer
          rect={rect}
          leftColumnsWidth={leftGridWidth}
          rightColumnsWidth={rightGridWidth}
          topRowsHeight={topGridHeight}
          bottomRowsHeight={dataGridHeight}
        >
          <HeaderGrid
            columnWidthCallback={getLeftColumnWidth}
            rowHightCallback={rowHightCallback}
            width={leftGridWidth}
            height={headerGridHeight}
            headersData={headersData}
          />

          <TopGrid
            dataModel={dataModel}
            constraints={constraints}
            topGridRef={topGridRef}
            getMeasureInfoWidth={getMeasureInfoWidth}
            rowHightCallback={rowHightCallback}
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
            rowHightCallback={rowHightCallback}
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
