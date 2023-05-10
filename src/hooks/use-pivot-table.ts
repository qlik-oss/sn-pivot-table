import { useEffect, useState, type stardust } from "@nebula.js/stardust";
import type { Root } from "react-dom/client";
import render from "../pivot-table/Root";
import { MAX_ROW_COUNT } from "../pivot-table/constants";
import type { Model } from "../types/QIX";
import type { ExtendedSelections, ExtendedTranslator, LayoutService, StyleService, ViewService } from "../types/types";
import useLoadDataPages from "./use-load-data-pages";

interface UsePivotTableProps {
  model: Model;
  rect: stardust.Rect;
  constraints: stardust.Constraints;
  selections: ExtendedSelections;
  viewService: ViewService;
  layoutService: LayoutService;
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
  styleService,
  reactRoot,
  isFontLoaded,
  translator,
  language,
}: UsePivotTableProps) => {
  const {
    size,
    layout: {
      qHyperCube: { qSize },
    },
  } = layoutService;

  const rowsPerPage = Math.min(qSize.qcy, MAX_ROW_COUNT);
  const totalPages = Math.ceil(qSize.qcy / rowsPerPage);

  const [pageInfo, setPageInfo] = useState<PageInfo>({
    currentPage: 0,
    shouldShowPagination: qSize.qcy > size.y,
    totalPages,
    rowsPerPage,
    totalRowCount: qSize.qcy,
  });

  const { qPivotDataPages, isLoading } = useLoadDataPages(model, layoutService, viewService);

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
      !!qPivotDataPages &&
      pageInfo &&
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
    setPageInfo,
    translator,
    language,
    pageInfo,
  ]);
};

export default usePivotTable;
