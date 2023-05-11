import { useEffect, type stardust } from "@nebula.js/stardust";
import type { Root } from "react-dom/client";
import render from "../pivot-table/Root";
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
    translator,
    language,
  ]);
};

export default usePivotTable;
