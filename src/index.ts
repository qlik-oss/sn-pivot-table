/* eslint-disable react-hooks/rules-of-hooks */
import {
  useConstraints,
  useEffect,
  useElement,
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
import useViewService from "./hooks/use-view-service";
import render from "./pivot-table/Root";
import createDataDefinition from "./qae/data-definition";
import initialProperties from "./qae/initial-properties";
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
          theme
        ) {
          render(reactRoot, {
            model,
            rect,
            constraints,
            selections,
            viewService,
            layoutService,
            qPivotDataPages,
            theme,
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
        theme,
        reactRoot,
      ]);
    },
  };
}
