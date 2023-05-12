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
  useState,
  useTheme,
} from "@nebula.js/stardust";
import render from "../pivot-table/Root";
import { MAX_ROW_COUNT } from "../pivot-table/constants";
import createStyleService from "../services/style-service";
import type { Model, PivotLayout } from "../types/QIX";
import type { ExtendedSelections, ExtendedTheme, PageInfo } from "../types/types";
import useLayoutService from "./use-layout-service";
import useLoadDataPages from "./use-load-data-pages";
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
  const { qPivotDataPages, isLoading } = useLoadDataPages(model, layoutService, viewService);
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
