/* eslint-disable react-hooks/rules-of-hooks */
import {
  useConstraints,
  useEffect,
  useElement,
  useMemo,
  useModel,
  useRect,
  useSelections,
  useStaleLayout,
  useTheme,
} from "@nebula.js/stardust";
import render from "../pivot-table/Root";
import createStyleService from "../services/style-service";
import type { Model, PivotLayout } from "../types/QIX";
import type { ExtendedSelections, ExtendedTheme } from "../types/types";
import useLayoutService from "./use-layout-service";
import useLoadDataPages from "./use-load-data-pages";
import usePagination from "./use-pagination";
import useReactRoot from "./use-react-root";
import useSnapshot from "./use-snapshot";
import useTranslations from "./use-translations";
import useViewService from "./use-view-service";
import useWaitForFonts from "./use-wait-for-fonts";

const useRender = () => {
  const element = useElement();
  const reactRoot = useReactRoot(element);
  const layout = useStaleLayout() as PivotLayout;
  const model = useModel() as Model;
  const constraints = useConstraints();
  const layoutService = useLayoutService(layout);
  const selections = useSelections() as ExtendedSelections;
  const theme = useTheme() as ExtendedTheme;
  const { translator, language } = useTranslations();
  const { pageInfo, updatePageInfo } = usePagination(layoutService);
  const viewService = useViewService(pageInfo);
  const rect = useSnapshot({ rect: useRect(), layoutService, viewService, model });
  const { qPivotDataPages, isLoading } = useLoadDataPages({ model, layoutService, viewService, pageInfo });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const styleService = useMemo(() => createStyleService(theme, layoutService), [theme.name(), layoutService]);
  const fonts = useMemo(
    () => [
      `600 ${styleService.header.fontSize} ${styleService.header.fontFamily}`,
      `600 ${styleService.columnContent.fontSize} ${styleService.columnContent.fontFamily}`,
      `${styleService.columnContent.fontSize} ${styleService.columnContent.fontFamily}`,
      `600 ${styleService.rowContent.fontSize} ${styleService.rowContent.fontFamily}`,
      `${styleService.rowContent.fontSize} ${styleService.rowContent.fontFamily}`,
      `${styleService.content.fontSize} ${styleService.content.fontFamily}`,
    ],
    [styleService]
  );
  const isFontLoaded = useWaitForFonts(fonts);

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
      pageInfo,
      updatePageInfo,
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
    pageInfo,
    updatePageInfo,
  ]);
};

export default useRender;
