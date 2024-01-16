import {
  useApp,
  useEffect,
  useElement,
  useEmbed,
  useInteractionState,
  useKeyboard,
  useMemo,
  useModel,
  useRect,
  useSelections,
  useStaleLayout,
} from "@nebula.js/stardust";
import { useExtendedTheme, useReactRoot, useWaitForFonts } from "@qlik/nebula-table-utils/lib/hooks";
import render from "../pivot-table/Root";
import createStyleService from "../services/style-service";
import type { Model, PivotLayout } from "../types/QIX";
import type { ExtendedSelections, Galaxy } from "../types/types";
import useEffectiveProperties from "./use-effective-properties";
import useFonts from "./use-fonts";
import useLayoutService from "./use-layout-service";
import useLoadDataPages from "./use-load-data-pages";
import usePagination from "./use-pagination";
import useSnapshot from "./use-snapshot";
import useTranslations from "./use-translations";
import useViewService from "./use-view-service";

const useRender = (env: Galaxy) => {
  const { flags } = env;
  const element = useElement();
  const reactRoot = useReactRoot(element);
  const layout = useStaleLayout() as PivotLayout;
  const model = useModel() as Model;
  const app = useApp();
  const embed = useEmbed();
  const keyboard = useKeyboard();
  const interactions = useInteractionState();
  const [effectiveProperties, isLoadingEffectiveProperties] = useEffectiveProperties(model, layout);
  const layoutService = useLayoutService(layout, effectiveProperties);
  const selections = useSelections() as ExtendedSelections;
  const theme = useExtendedTheme(element);
  const themeName = theme.name();
  const { translator, language } = useTranslations();
  const { pageInfo, updatePageInfo } = usePagination(layoutService);
  const viewService = useViewService(pageInfo);
  const rect = useSnapshot({ rect: useRect(), layoutService, viewService, model });
  const [qPivotDataPages, isLoading] = useLoadDataPages({ model, layoutService, viewService, pageInfo, rect });
  // It needs to be theme.name() because the reference to the theme object does not change when a theme is changed
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const styleService = useMemo(() => createStyleService(theme, layoutService), [theme.name(), layoutService]);
  const fonts = useFonts(styleService);
  const isFontLoaded = useWaitForFonts(fonts);

  useEffect(() => {
    const isReadyToRender =
      !isLoading &&
      model &&
      rect?.width &&
      rect?.height &&
      selections &&
      viewService &&
      layoutService &&
      styleService &&
      !!qPivotDataPages &&
      !isLoadingEffectiveProperties &&
      isFontLoaded;

    if (!isReadyToRender) return;

    render(reactRoot, {
      model,
      app,
      rect,
      selections,
      viewService,
      layoutService,
      qPivotDataPages,
      styleService,
      translator,
      pageInfo,
      updatePageInfo,
      interactions,
      embed,
      keyboard,
      theme,
      flags,
    });
  }, [
    model,
    app,
    rect,
    rect?.width,
    rect?.height,
    interactions,
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
    effectiveProperties,
    isLoadingEffectiveProperties,
    embed,
    keyboard,
    theme,
    themeName,
    flags,
  ]);
};

export default useRender;
