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
import ext from "./ext";
import useLayoutService from "./hooks/use-layout-service";
import useLoadDataPages from "./hooks/use-load-data-pages";
import useReactRoot from "./hooks/use-react-root";
import useSnapshot from "./hooks/use-snapshot";
import { useTranslations } from "./hooks/use-translations";
import useViewService from "./hooks/use-view-service";
import useWaitForFonts from "./hooks/use-wait-for-fonts";
import render from "./pivot-table/Root";
import createDataDefinition from "./qae/data-definition";
import initialProperties from "./qae/initial-properties";
import createStyleService from "./services/style-service";
import { Model, PivotLayout } from "./types/QIX";
import { ExtendedSelections, ExtendedTheme, Galaxy } from "./types/types";

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default function supernova(env: Galaxy) {
  return {
    qae: {
      properties: {
        initial: initialProperties,
      },
      data: createDataDefinition(env),
    },
    ext: ext(env),
    component() {
      const element = useElement();
      const reactRoot = useReactRoot(element);
      const layout = useStaleLayout() as PivotLayout;
      const model = useModel() as Model;
      let rect = useRect();
      const constraints = useConstraints();
      const viewService = useViewService();
      const layoutService = useLayoutService(layout);
      const { qPivotDataPages, isLoading } = useLoadDataPages(model, layoutService, viewService);
      const selections = useSelections() as ExtendedSelections;
      const theme = useTheme() as ExtendedTheme;
      // eslint-disable-next-line react-hooks/exhaustive-deps
      const styleService = useMemo(() => createStyleService(theme), [theme.name()]);
      const fonts = useMemo(
        () => [
          `600 ${styleService.header.fontSize} ${styleService.header.fontFamily}`,
          `${styleService.content.fontSize} ${styleService.content.fontFamily}`,
        ],
        [styleService]
      );
      const isFontLoaded = useWaitForFonts(fonts);
      const { translator, language } = useTranslations();

      rect = useSnapshot({ layoutService, viewService, rect, model });

      useEffect(() => {
        if (
          !isLoading &&
          model &&
          rect?.width &&
          rect?.height &&
          constraints &&
          selections &&
          viewService &&
          layoutService &&
          styleService &&
          isFontLoaded
        ) {
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
        }
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
    },
  };
}
