import { useElement, useLayout, useEffect } from '@nebula.js/stardust';
import properties from './object-properties';
import data from './data';
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
      const layout = useLayout();

      useEffect(() => {
        render(element);
      }, [layout]);

      useEffect(
        () => () => {
          teardown(element);
        },
        [],
      );
    },
  };
}
