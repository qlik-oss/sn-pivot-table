import { Q_PATH } from '../constants';
import { ExpandOrCollapser } from '../types/types';
import useNebulaCallback from './use-nebula-callback';

interface ExpandOrCollapserResult {
  collapseLeft: ExpandOrCollapser
  collapseTop: ExpandOrCollapser
  expandLeft: ExpandOrCollapser
  expandTop: ExpandOrCollapser
}

export default function useExpandOrCollapser(model: EngineAPI.IGenericObject | undefined): ExpandOrCollapserResult {
  const collapseLeft = useNebulaCallback<ExpandOrCollapser>(async (rowIndex: number, colIndex: number) => {
    if (!model) return;

    await model.collapseLeft(Q_PATH, rowIndex, colIndex, false);
  }, [model]);

  const collapseTop = useNebulaCallback<ExpandOrCollapser>(async (rowIndex: number, colIndex: number) => {
    if (!model) return;

    await model.collapseTop(Q_PATH, rowIndex, colIndex, false);
  }, [model]);

  const expandLeft = useNebulaCallback<ExpandOrCollapser>(async (rowIndex: number, colIndex: number) => {
    if (!model) return;

    await model.expandLeft(Q_PATH, rowIndex, colIndex, false);
  }, [model]);

  const expandTop = useNebulaCallback<ExpandOrCollapser>(async (rowIndex: number, colIndex: number) => {
    if (!model) return;

    await model.expandTop(Q_PATH, rowIndex, colIndex, false);
  }, [model]);

  return {
    collapseLeft,
    collapseTop,
    expandLeft,
    expandTop,
  };
}
