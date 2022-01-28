import { useMemo, useState } from '@nebula.js/stardust';
import { ExpandOrCollapser, Model } from '../types/types';

const PATH = '/qHyperCubeDef';

interface ExpandOrCollapseIndex {
  direction: string;
  rowIndex: number;
  colIndex: number;
  expand: boolean;
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
      expand: false,
      hasChanged: prev?.rowIndex !== rowIndex || prev?.colIndex !== colIndex || prev?.expand !== false,
    }));
  }, [model]);

  const collapseTop: ExpandOrCollapser = useMemo(() => async (rowIndex: number, colIndex: number) => {
    await model.collapseTop(PATH, rowIndex, colIndex, false);
    setExpandOrCollapseIndex((prev: ExpandOrCollapseIndex) => ({
      direction: 'column',
      rowIndex,
      colIndex,
      expand: false,
      hasChanged: prev?.rowIndex !== rowIndex || prev?.colIndex !== colIndex || prev?.expand !== false,
    }));
  }, [model]);

  const expandLeft: ExpandOrCollapser = useMemo(() => async (rowIndex: number, colIndex: number) => {
    await model.expandLeft(PATH, rowIndex, colIndex, false);
    setExpandOrCollapseIndex((prev: ExpandOrCollapseIndex) => ({
      direction: 'row',
      rowIndex,
      colIndex,
      expand: true,
      hasChanged: prev?.rowIndex !== rowIndex || prev?.colIndex !== colIndex || prev?.expand !== true,
    }));
  }, [model]);

  const expandTop: ExpandOrCollapser = useMemo(() => async (rowIndex: number, colIndex: number) => {
    await model.expandTop(PATH, rowIndex, colIndex, false);
    setExpandOrCollapseIndex((prev: ExpandOrCollapseIndex) => ({
      direction: 'column',
      rowIndex,
      colIndex,
      expand: true,
      hasChanged: prev?.rowIndex !== rowIndex || prev?.colIndex !== colIndex || prev?.expand !== true,
    }));
  }, [model])

  return {
    collapseLeft,
    collapseTop,
    expandLeft,
    expandTop,
    expandOrCollapseIndex
  }
}
