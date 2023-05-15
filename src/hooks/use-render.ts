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
import type { ExtendedSelections, ExtendedTheme, PageInfo } from "../types/types";
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
  const viewService = useViewService();
  const layoutService = useLayoutService(layout);
  const rect = useSnapshot({ rect: useRect(), layoutService, viewService, model });
  const selections = useSelections() as ExtendedSelections;
  const theme = useTheme() as ExtendedTheme;
  const { translator, language } = useTranslations();
  const { pageInfo, setPageInfo } = usePagination(layoutService);
  const { qPivotDataPages, isLoading } = useLoadDataPages({ model, layoutService, viewService, pageInfo });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const styleService = useMemo(() => createStyleService(theme, layoutService), [theme.name(), layoutService]);
  const fonts = useMemo(
    () => [
      `600 ${styleService.header.fontSize} ${styleService.header.fontFamily}`,
      `${styleService.content.fontSize} ${styleService.content.fontFamily}`,
    ],
    [styleService]
  );
  const isFontLoaded = useWaitForFonts(fonts);

  // console.log("qLastExpandedPos:", layoutService.layout.qHyperCube.qLastExpandedPos);
  // console.log("qSize: ", layoutService.layout.qHyperCube.qSize);

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
      updatePageInfo: (args: Partial<PageInfo>) => setPageInfo({ ...pageInfo, ...args }),
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
    setPageInfo,
  ]);
};

export default useRender;
