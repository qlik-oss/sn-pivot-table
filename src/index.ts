import { useElement, useStaleLayout, useEffect, useModel, useRect, useConstraints } from '@nebula.js/stardust';
import properties from './object-properties';
import data from './data';
import { render, teardown } from './pivot-table/Root';
import useDataModel from './hooks/use-data-model';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default function supernova() {
  return {
    qae: {
      properties: {
        initial: properties,
      },
      data,
    },
    component() {
      const element = useElement();
      const layout = useStaleLayout() as EngineAPI.IGenericHyperCubeLayout;
      const model = useModel();
      const rect = useRect();
      const constraints = useConstraints();
      const dataModel = useDataModel(layout, model);

      console.debug('component', layout);
      useEffect(() => {
        console.debug('render', layout);
        if (dataModel.hasData && rect && constraints) {
          render(element, {
            rect,
            constraints,
            dataModel
          });
        }
      }, [dataModel, rect, constraints]);

      useEffect(() => () => {
          teardown(element);
        }, []);
    },
  };
}
