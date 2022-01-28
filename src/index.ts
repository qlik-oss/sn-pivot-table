import { useElement, useStaleLayout, useEffect, useModel, useMemo, useRect, useConstraints } from '@nebula.js/stardust';
import properties from './object-properties';
import data from './data';
import { render, teardown } from './pivot-table/Root';
import useDataLoader from './hooks/use-data-loader';

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
      const {
        pivotData,
        fetchNextPage,
        hasMoreColumns,
        hasMoreRows,
        collapseLeft,
        collapseTop,
        expandLeft,
        expandTop,
      } = useDataLoader(layout, model);

      useMemo(() => {
        if (pivotData && model && rect && constraints && fetchNextPage) {
          render(element, {
            model,
            rect,
            constraints,
            pivotData,
            fetchNextPage,
            hasMoreColumns,
            hasMoreRows,
            collapseLeft,
            collapseTop,
            expandLeft,
            expandTop,
          });
        }
      }, [hasMoreRows, hasMoreColumns, pivotData, model, rect, constraints, fetchNextPage]);

      useEffect(
        () => () => {
          teardown(element);
        },
        []
      );
    },
  };
}
