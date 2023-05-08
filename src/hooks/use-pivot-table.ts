import { stardust, useEffect, useState } from "@nebula.js/stardust";
import type { Root } from "react-dom/client";
import render from "../pivot-table/Root";
import { MAX_ROW_COUNT } from "../pivot-table/constants";
import { usePVData } from "../pivot-table/data/use-pv-data";
import type { Model } from "../types/QIX";
import type { ExtendedSelections, ExtendedTranslator, LayoutService, StyleService, ViewService } from "../types/types";

interface usePivotTable {
  model: Model;
  rect: stardust.Rect;
  constraints: stardust.Constraints;
  selections: ExtendedSelections;
  viewService: ViewService;
  layoutService: LayoutService;
  isLoading: boolean;
  qPivotDataPages: EngineAPI.INxPivotPage[];
  styleService: StyleService;
  reactRoot: Root;
  isFontLoaded: boolean;
  translator: ExtendedTranslator;
  language: string;
}

export interface PageInfo {
  currentPage: number;
  shouldShowPagination: boolean;
  totalPages: number;
  rowsPerPage: number;
  totalRowCount: number;
}

const usePivotTable = ({
  model,
  rect,
  constraints,
  selections,
  viewService,
  layoutService,
  isLoading,
  qPivotDataPages,
  styleService,
  reactRoot,
  isFontLoaded,
  translator,
  language,
}: usePivotTable) => {
  const {
    size,
    layout: {
      qHyperCube: { qSize },
    },
  } = layoutService;

  const qcy = layoutService.layout.qHyperCube.qSize.qcy;
  const rowsPerPage = qcy <= MAX_ROW_COUNT ? qcy : MAX_ROW_COUNT;
  const totalPages = Math.ceil(qcy / rowsPerPage);

  const [pageInfo, setPageInfo] = useState<PageInfo>({
    currentPage: 0,
    shouldShowPagination: qSize.qcy > size.y,
    totalPages,
    rowsPerPage,
    totalRowCount: qSize.qcy,
  });

  const pvData = usePVData({ qPivotDataPages, layoutService, pageInfo });

  const updatePageInfo = (args: Partial<PageInfo>) => setPageInfo({ ...pageInfo, ...args });

  useEffect(() => {
    const isReadyToRender =
      !isLoading &&
      model &&
      rect?.width &&
      rect?.height &&
      constraints &&
      selections &&
      viewService &&
      layoutService &&
      styleService &&
      pageInfo &&
      !!pvData &&
      isFontLoaded;

    if (!isReadyToRender) return;

    render(reactRoot, {
      model,
      rect,
      constraints,
      selections,
      viewService,
      layoutService,
      qPivotDataPages,
      styleService,
      pageInfo,
      updatePageInfo,
      pvData,
      translator,
    });
  }, [
    model,
    rect,
    rect?.width,
    rect?.height,
    constraints,
    selections,
    viewService,
    layoutService,
    isLoading,
    qPivotDataPages,
    styleService,
    reactRoot,
    isFontLoaded,
    pageInfo,
    updatePageInfo,
    pvData,
    translator,
    language,
  ]);
};

export default usePivotTable;
