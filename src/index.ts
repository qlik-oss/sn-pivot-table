import { useElement, useStaleLayout, useEffect, useModel, useMemo, useRect } from '@nebula.js/stardust';
import properties from './object-properties';
import data from './data';
import { render, teardown } from './pivot-table/Root';


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

      useMemo(() => {
        if (layout && model) {
          render(element, {
            model,
            layout,
            rect
          });
        }
      }, [layout, model, rect]);

      useEffect(
        () => () => {
          teardown(element);
        },
        []
      );
    },
  };
}
