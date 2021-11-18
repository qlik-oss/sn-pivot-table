import { useElement, useStaleLayout, useEffect, useModel } from '@nebula.js/stardust';
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

      useEffect(() => {
        if (layout && model) {
          render(element, {
            model,
            layout
          });
        }
      }, [layout, model]);

      useEffect(
        () => () => {
          teardown(element);
        },
        []
      );
    },
  };
}
