import { useElement, useStaleLayout, useEffect, useModel, useRect, useConstraints, useSelections } from '@nebula.js/stardust';
import initialProperties from './qae/initial-properties';
import data from './qae/data-definition';
import ext from './ext';
import { render, teardown } from './pivot-table/Root';
import useDataModel from './hooks/use-data-model';
import { ExtendedSelections, Galaxy } from './types/types';
import useViewService from './hooks/use-view-service';
import { PivotLayout } from './types/QIX';
import useLayoutService from './hooks/use-layout-service';
import useDataService from './hooks/use-data-service';

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
      const dataService = useDataService(layout);
      const dataModel = useDataModel(model, layoutService, dataService, viewService);
      const selections = useSelections() as ExtendedSelections;

      useEffect(() => {
        if (rect?.width && rect?.height && constraints && selections && viewService && layoutService) {
          console.debug('render', { selections, constraints, dataModel, rect, model, viewService, layoutService, dataService });
          render(element, {
            rect,
            constraints,
            dataModel,
            selections,
            viewService,
            layoutService
          });
        }
      }, [dataModel, rect?.width, rect?.height, constraints, selections, viewService, layoutService, dataService]);

      useEffect(() => () => {
          teardown(element);
        }, []);
    },
  };
}
