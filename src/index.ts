import { useElement, useStaleLayout, useEffect, useModel, useRect, useConstraints, useSelections } from '@nebula.js/stardust';
import initialProperties from './qae/initial-properties';
import data from './qae/data-definition';
import ext from './ext';
import { render, teardown } from './pivot-table/Root';
// import useDataModel from './hooks/use-data-model';
import { ExtendedSelections, Galaxy } from './types/types';
import useViewService from './hooks/use-view-service';
import { PivotLayout } from './types/QIX';
import useLayoutService from './hooks/use-layout-service';
import useLoadDataPages from './hooks/use-load-data-pages';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default function supernova(env: Galaxy) {
  return {
    qae: {
      properties: {
        initial: initialProperties,
      },
      data,
    },
    ext: ext(env),
    component() {
      const element = useElement();
      const layout = useStaleLayout() as PivotLayout;
      const model = useModel();
      const rect = useRect();
      const constraints = useConstraints();
      const viewService = useViewService();
      const layoutService = useLayoutService(layout);
      const { qPivotDataPages, isLoading } = useLoadDataPages(model, layoutService, viewService);
      const selections = useSelections() as ExtendedSelections;

      useEffect(() => {
        if (!isLoading && model && rect?.width && rect?.height && constraints && selections && viewService && layoutService) {
          console.debug('render', { qPivotDataPages, selections, constraints, rect, model, viewService, layoutService, isLoading });
          render(element, {
            model,
            rect,
            constraints,
            selections,
            viewService,
            layoutService,
            qPivotDataPages
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
      ]);

      useEffect(() => () => {
          teardown(element);
        }, []);
    },
  };
}
