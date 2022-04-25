import { useCallback, useMemo } from 'react';
import { PSEUDO_DIMENSION_INDEX } from '../../constants';
import NxDimCellType from '../../types/QIX';
import { DataModel, LayoutService, Rect } from '../../types/types';
import useMeasureText from './use-measure-text';

interface ColumnWidthHook {
  leftGridWidth: number;
  rightGridWidth: number;
  totalMeasureInfoColumnWidth: number;
  getLeftColumnWidth: (index: number) => number;
  getDataColumnWidth: (index: number) => number;
  getMeasureInfoWidth: (index: number) => number;
  getTotalWidth: () => number;
}

export const EXPAND_ICON_WIDTH = 30;
const MIN_COLUMN_WIDTH = 100;
const MAX_RATIO_OF_TOTAL_WIDTH = 0.75;

export default function useColumnWidth(layoutService: LayoutService, dataModel: DataModel, rect: Rect): ColumnWidthHook {
  const { estimateWidth, measureText } = useMeasureText('13px', '"Source Sans Pro", sans-serif'); // TODO Hard-coded...
  const { pivotData } = dataModel;
  const { qDimensionInfo, qMeasureInfo, qNoOfLeftDims } = layoutService.layout.qHyperCube;

  const hasPseudoDimOnLeft = useMemo(
    () => pivotData.left.some(column => column[0] !== null && column[0].ref.qType === NxDimCellType.NX_DIM_CELL_PSEUDO),
    [pivotData.left]
  );

  const leftColumnWidthsRatios = useMemo(() => {
    const ratios = pivotData.leftDimensionInfoIndexMap
      .map((dimIndex, index) => {
        if (dimIndex === PSEUDO_DIMENSION_INDEX) {
          const pseudoDimensionWidth = Math.max(
            ...qMeasureInfo
            .map(m => measureText(m.qFallbackTitle))
          );

          return pseudoDimensionWidth / rect.width;
        }

        const { qFallbackTitle, qApprMaxGlyphCount } = qDimensionInfo[dimIndex];
        const hasChildNodes = index < qNoOfLeftDims - 1; // -1 as the last column can not be expanded or collapsed
        const collapseExpandIconSize = hasChildNodes ? EXPAND_ICON_WIDTH : 0;
        const w = Math.max(
          measureText(qFallbackTitle),
          estimateWidth(qApprMaxGlyphCount) + collapseExpandIconSize
        );
        return w / rect.width;
      });

    const sumOfRatios = ratios.reduce((sum, r) => sum + r, 0);
    if (sumOfRatios < MAX_RATIO_OF_TOTAL_WIDTH) return ratios;

    const multiplier = MAX_RATIO_OF_TOTAL_WIDTH / sumOfRatios;
    return ratios.map(r => r * multiplier);

  }, [estimateWidth, measureText, pivotData.leftDimensionInfoIndexMap, rect.width, qDimensionInfo, qMeasureInfo, qNoOfLeftDims]);

  const getLeftColumnWidth = useCallback(
    (index) => leftColumnWidthsRatios[index] * rect.width,
    [leftColumnWidthsRatios, rect]
  );

  const leftGridWidth = useMemo(
    () => pivotData.left.reduce((width, _, index) => width + getLeftColumnWidth(index), 0),
    [pivotData.left, getLeftColumnWidth]
  );

  const rightGridWidth = useMemo(
    () => Math.max(rect.width - leftGridWidth),
    [leftGridWidth, rect.width]
  );

  const preCalcTotalDataColumnWidth = useMemo(() => {
    const totalWidth = qMeasureInfo.reduce((width, { qApprMaxGlyphCount, qFallbackTitle }) => width + Math.max(
      MIN_COLUMN_WIDTH,
      estimateWidth(qApprMaxGlyphCount),
      measureText(qFallbackTitle),
    ), 0);

    return totalWidth;
  }, [qMeasureInfo, estimateWidth, measureText]);

  const getMeasureInfoWidth = useCallback((measureInfoIndex: number) => {
    const getWidth = (index: number) => {
      const { qApprMaxGlyphCount, qFallbackTitle } = qMeasureInfo[index];
      const availableWidth = preCalcTotalDataColumnWidth >= rightGridWidth ? 0 : rightGridWidth;

      return Math.max(
        MIN_COLUMN_WIDTH,
        availableWidth / pivotData.size.data.x,
        estimateWidth(qApprMaxGlyphCount),
        measureText(qFallbackTitle),
      );
    };

    if (hasPseudoDimOnLeft) {
      return Math.max(...qMeasureInfo.map((m, index) => getWidth(index)));
    }

    return getWidth(measureInfoIndex);
  }, [rightGridWidth, pivotData.size.data.x, preCalcTotalDataColumnWidth, estimateWidth, measureText, qMeasureInfo, hasPseudoDimOnLeft]);

  const getDataColumnWidth = useCallback((colIndex: number) => {
    const measureInfoIndex = colIndex % qMeasureInfo.length;
    return getMeasureInfoWidth(measureInfoIndex);
  }, [getMeasureInfoWidth, qMeasureInfo]);

  const getTotalWidth = useCallback(() => Array
      .from({ length: pivotData.size.data.x }, () => null)
      .reduce((width, _, index) => width + getDataColumnWidth(index), leftGridWidth),
    [getDataColumnWidth, leftGridWidth, pivotData.size.data.x]
  );

  const totalMeasureInfoColumnWidth = useMemo(
    () => qMeasureInfo.reduce((width, _, index) => width + getDataColumnWidth(index), 0),
    [qMeasureInfo, getDataColumnWidth]
  );

  return {
    leftGridWidth,
    rightGridWidth,
    totalMeasureInfoColumnWidth,
    getLeftColumnWidth,
    getDataColumnWidth,
    getMeasureInfoWidth,
    getTotalWidth
  };
}
