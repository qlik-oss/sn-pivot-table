import { useElement, useStaleLayout, useEffect, useModel, useRect, useConstraints, useSelections } from '@nebula.js/stardust';
import initialProperties from './qae/initial-properties';
import data from './qae/data-definition';
import ext from './ext';
import { render, teardown } from './pivot-table/Root';
import useDataModel from './hooks/use-data-model';
import { ExtendedSelections, Galaxy } from './types/types';
import useViewService from './hooks/use-view-service';
import { PivotLayout } from './types/QIX';

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
      const dataModel = useDataModel(layout, model, viewService);
      const selections = useSelections() as ExtendedSelections;

      useEffect(() => {
        if (dataModel.hasData && rect?.width && rect?.height && constraints && selections && viewService) {
          console.debug('render', { layout: { ...layout }, selections, constraints, dataModel, rect, model, viewService });
          render(element, {
            rect,
            constraints,
            dataModel,
            selections,
            viewService
          });
        }
      }, [dataModel, rect?.width, rect?.height, constraints, selections, viewService]);

      useEffect(() => () => {
          teardown(element);
        }, []);
    },
  };
}
