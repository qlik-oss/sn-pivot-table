import { useMemo, useState } from '@nebula.js/stardust';
import { ExpandOrCollapser } from '../types/types';

const PATH = '/qHyperCubeDef';

interface ExpandOrCollapseIndex {
  direction?: string;
  rowIndex?: number;
  colIndex?: number;
  expanded?: boolean;
  hasChanged: boolean;
}

interface ExpandOrCollapserResult {
  collapseLeft: ExpandOrCollapser
  collapseTop: ExpandOrCollapser
  expandLeft: ExpandOrCollapser
  expandTop: ExpandOrCollapser
  expandOrCollapseIndex: ExpandOrCollapseIndex;
}

export default function useExpandOrCollapser(model: EngineAPI.IGenericObject | undefined): ExpandOrCollapserResult {
  const [expandOrCollapseIndex, setExpandOrCollapseIndex] = useState<ExpandOrCollapseIndex>({ hasChanged: false });

  const collapseLeft = useMemo<ExpandOrCollapser>(() => async (rowIndex: number, colIndex: number) => {
    if (!model) return;

    await model.collapseLeft(PATH, rowIndex, colIndex, false);

    setExpandOrCollapseIndex((prev: ExpandOrCollapseIndex) => ({
      direction: 'row',
      rowIndex,
      colIndex,
      expanded: false,
      hasChanged: prev?.rowIndex !== rowIndex || prev?.colIndex !== colIndex || prev?.expanded !== false,
    }));
  }, [model]);

  const collapseTop = useMemo<ExpandOrCollapser>(() => async (rowIndex: number, colIndex: number) => {
    if (!model) return;

    await model.collapseTop(PATH, rowIndex, colIndex, false);

    setExpandOrCollapseIndex((prev: ExpandOrCollapseIndex) => ({
      direction: 'column',
      rowIndex,
      colIndex,
      expanded: false,
      hasChanged: prev?.rowIndex !== rowIndex || prev?.colIndex !== colIndex || prev?.expanded !== false,
    }));
  }, [model]);

  const expandLeft = useMemo<ExpandOrCollapser>(() => async (rowIndex: number, colIndex: number) => {
    if (!model) return;

    await model.expandLeft(PATH, rowIndex, colIndex, false);

    setExpandOrCollapseIndex((prev: ExpandOrCollapseIndex) => ({
      direction: 'row',
      rowIndex,
      colIndex,
      expanded: true,
      hasChanged: prev?.rowIndex !== rowIndex || prev?.colIndex !== colIndex || prev?.expanded !== true,
    }));
  }, [model]);

  const expandTop = useMemo<ExpandOrCollapser>(() => async (rowIndex: number, colIndex: number) => {
    if (!model) return;

    await model.expandTop(PATH, rowIndex, colIndex, false);

    setExpandOrCollapseIndex((prev: ExpandOrCollapseIndex) => ({
      direction: 'column',
      rowIndex,
      colIndex,
      expanded: true,
      hasChanged: prev?.rowIndex !== rowIndex || prev?.colIndex !== colIndex || prev?.expanded !== true,
    }));
  }, [model]);

  return {
    collapseLeft,
    collapseTop,
    expandLeft,
    expandTop,
    expandOrCollapseIndex
  };
}
