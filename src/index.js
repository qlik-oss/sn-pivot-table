import { useElement, useStaleLayout, useEffect, usePromise, useState, useModel } from '@nebula.js/stardust';
import properties from './object-properties';
import data from './data';
import manageData from './pivot-table/handle-data';
import { render, teardown } from './pivot-table/Root';

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
      const [pageInfo] = useState(() => ({ top: 0, height: 100 }));
      const [pivotData] = usePromise(() => manageData(layout, pageInfo), [layout, pageInfo]);

      useEffect(() => {
        if (layout && pivotData && model) {
          render(element, {
            pivotData,
            model,
          });
        }
      }, [layout, pivotData, model]);

      useEffect(
        () => () => {
          teardown(element);
        },
        []
      );
    },
  };
}
