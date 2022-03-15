import { useElement, useStaleLayout, useEffect, useModel, useRect, useConstraints, useSelections } from '@nebula.js/stardust';
import initialProperties from './qae/initial-properties';
import data from './qae/data-definition';
import ext from './ext';
import { render, teardown } from './pivot-table/Root';
import useDataModel from './hooks/use-data-model';
import { ExtendedSelections } from './types/types';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default function supernova() {
  return {
    qae: {
      properties: {
        initial: initialProperties,
      },
      data,
    },
    ext: ext(),
    component() {
      const element = useElement();
      const layout = useStaleLayout() as EngineAPI.IGenericHyperCubeLayout;
      const model = useModel();
      const rect = useRect();
      const constraints = useConstraints();
      const dataModel = useDataModel(layout, model);
      const selections = useSelections() as ExtendedSelections;

      useEffect(() => {
        if (dataModel.hasData && rect?.width && rect?.height && constraints && selections) {
          console.debug('render', { layout, selections, constraints, dataModel, rect });
          render(element, {
            rect,
            constraints,
            dataModel,
            selections
          });
        }
      }, [dataModel, rect?.width, rect?.height, constraints, selections]);

      useEffect(() => () => {
          teardown(element);
        }, []);
    },
  };
}
