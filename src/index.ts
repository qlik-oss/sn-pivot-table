import { useElement, useStaleLayout, useEffect, useModel, useRect, useConstraints, useSelections, useTheme, useMemo } from '@nebula.js/stardust';
import initialProperties from './qae/initial-properties';
import createDataDefinition from './qae/data-definition';
import ext from './ext';
import { render, teardown } from './pivot-table/Root';
import { ExtendedSelections, ExtendedTheme, Galaxy } from './types/types';
import useViewService from './hooks/use-view-service';
import { PivotLayout } from './types/QIX';
import useLayoutService from './hooks/use-layout-service';
import useLoadDataPages from './hooks/use-load-data-pages';
import createStyleService from './services/style-service';
import useSnapshot from './hooks/use-snapshot';

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
      const layout = useStaleLayout() as PivotLayout;
      const model = useModel();
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
          // console.debug(layoutService.layout.title, { qPivotDataPages, selections, constraints, rect, model, viewService, layoutService, styleService });
          render(element, {
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
      ]);

      useEffect(() => () => {
          teardown(element);
        }, []);
    },
  };
}
