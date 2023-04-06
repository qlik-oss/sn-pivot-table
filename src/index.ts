import { useElement, useStaleLayout, useEffect, useModel, useRect, useConstraints, useSelections, useTheme, useMemo } from '@nebula.js/stardust';
import initialProperties from './qae/initial-properties';
import createDataDefinition from './qae/data-definition';
import ext from './ext';
import { render } from './pivot-table/Root';
import { ExtendedSelections, ExtendedTheme, Galaxy } from './types/types';
import useViewService from './hooks/use-view-service';
import { Model, PivotLayout } from './types/QIX';
import useLayoutService from './hooks/use-layout-service';
import useLoadDataPages from './hooks/use-load-data-pages';
import createStyleService from './services/style-service';
import useSnapshot from './hooks/use-snapshot';
import useReactRoot from './hooks/use-react-root';

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
      const styleService = useMemo(() => createStyleService(theme), [theme.name()]);

      rect = useSnapshot({ layoutService, viewService, rect, model });

      useEffect(() => {
        if (!isLoading && model && rect?.width && rect?.height && constraints && selections && viewService && layoutService && styleService) {

          render(reactRoot, {
            model,
            rect,
            constraints,
            selections,
            viewService,
            layoutService,
            qPivotDataPages,
            styleService,
          });
        }
      }, [
        model,
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
      ]);
    },
  };
}
