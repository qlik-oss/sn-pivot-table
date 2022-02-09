import { useMemo, useState } from '@nebula.js/stardust';
import { ExpandOrCollapser, Model } from '../types/types';

const PATH = '/qHyperCubeDef';

interface ExpandOrCollapseIndex {
  direction: string;
  rowIndex: number;
  colIndex: number;
  expanded: boolean;
  hasChanged: boolean;
}

interface ExpandOrCollapserResult {
  collapseLeft: ExpandOrCollapser
  collapseTop: ExpandOrCollapser
  expandLeft: ExpandOrCollapser
  expandTop: ExpandOrCollapser
  expandOrCollapseIndex: ExpandOrCollapseIndex;
}

export default function useExpandOrCollapser(model: Model): ExpandOrCollapserResult {
  const [expandOrCollapseIndex, setExpandOrCollapseIndex] = useState({ hasChanged: false });

  const collapseLeft: ExpandOrCollapser = useMemo(() => async (rowIndex: number, colIndex: number) => {
    await model.collapseLeft(PATH, rowIndex, colIndex, false);
    setExpandOrCollapseIndex((prev: ExpandOrCollapseIndex) => ({
      direction: 'row',
      rowIndex,
      colIndex,
      expanded: false,
      hasChanged: prev?.rowIndex !== rowIndex || prev?.colIndex !== colIndex || prev?.expanded !== false,
    }));
  }, [model]);

  const collapseTop: ExpandOrCollapser = useMemo(() => async (rowIndex: number, colIndex: number) => {
    await model.collapseTop(PATH, rowIndex, colIndex, false);
    setExpandOrCollapseIndex((prev: ExpandOrCollapseIndex) => ({
      direction: 'column',
      rowIndex,
      colIndex,
      expanded: false,
      hasChanged: prev?.rowIndex !== rowIndex || prev?.colIndex !== colIndex || prev?.expanded !== false,
    }));
  }, [model]);

  const expandLeft: ExpandOrCollapser = useMemo(() => async (rowIndex: number, colIndex: number) => {
    await model.expandLeft(PATH, rowIndex, colIndex, false);
    setExpandOrCollapseIndex((prev: ExpandOrCollapseIndex) => ({
      direction: 'row',
      rowIndex,
      colIndex,
      expanded: true,
      hasChanged: prev?.rowIndex !== rowIndex || prev?.colIndex !== colIndex || prev?.expanded !== true,
    }));
  }, [model]);

  const expandTop: ExpandOrCollapser = useMemo(() => async (rowIndex: number, colIndex: number) => {
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
