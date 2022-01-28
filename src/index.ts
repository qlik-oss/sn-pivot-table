import { useElement, useStaleLayout, useEffect, useModel, useMemo, useRect, useConstraints } from '@nebula.js/stardust';
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
      const layout = useStaleLayout();
      const model = useModel();
      const rect = useRect();
      const constraints: Stardust.Constraints = useConstraints();
      const dataModel = useDataModel(layout, model);

      useMemo(() => {
        if (dataModel && dataModel.pivotData && model && rect && constraints) {
          render(element, {
            model,
            rect,
            constraints,
            dataModel
          });
        }
      }, [dataModel, dataModel.pivotData, model, rect, constraints]);

      useEffect(
        () => () => {
          teardown(element);
        },
        []
      );
    },
  };
}
