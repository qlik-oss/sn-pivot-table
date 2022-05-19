import { useCallback, useMemo } from 'react';
import { memoize } from 'qlik-chart-modules';
import { PSEUDO_DIMENSION_INDEX } from '../../constants';
import NxDimCellType from '../../types/QIX';
import { LayoutService, LeftDimensionData, MeasureData, Rect } from '../../types/types';
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

export default function useColumnWidth(
  layoutService: LayoutService,
  rect: Rect,
  leftDimensionData: LeftDimensionData,
  measureData: MeasureData,
): ColumnWidthHook {
  const { estimateWidth, measureText } = useMeasureText('13px', '"Source Sans Pro", sans-serif'); // TODO Hard-coded...
  const { qDimensionInfo, qMeasureInfo, qNoOfLeftDims } = layoutService.layout.qHyperCube;

  const hasPseudoDimOnLeft = useMemo(
    () => leftDimensionData.data.some(column => column[0] !== null && column[0].ref.qType === NxDimCellType.NX_DIM_CELL_PSEUDO),
    [leftDimensionData.data]
  );

  const leftColumnWidthsRatios = useMemo(() => {
    const ratios = leftDimensionData.dimensionInfoIndexMap
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

  }, [estimateWidth, measureText, leftDimensionData.dimensionInfoIndexMap, rect.width, qDimensionInfo, qMeasureInfo, qNoOfLeftDims]);

  const getLeftColumnWidth = useCallback(
    (index) => leftColumnWidthsRatios[index] * rect.width,
    [leftColumnWidthsRatios, rect.width]
  );

  const leftGridWidth = useMemo(
    () => leftDimensionData.data.reduce((width, _, index) => width + getLeftColumnWidth(index), 0),
    [leftDimensionData.data, getLeftColumnWidth]
  );

  const rightGridWidth = useMemo(
    () => Math.max(rect.width - leftGridWidth),
    [leftGridWidth, rect.width]
  );

  const preCalcTotalDataColumnWidth = useMemo(() => {
    if (hasPseudoDimOnLeft) {
      return qMeasureInfo.reduce((currentMaxWidth, { qApprMaxGlyphCount }) => Math.max(
        currentMaxWidth,
        MIN_COLUMN_WIDTH,
        estimateWidth(qApprMaxGlyphCount),
      ), 0);
    }


    return qMeasureInfo.reduce((width, { qApprMaxGlyphCount, qFallbackTitle }) => width + Math.max(
      MIN_COLUMN_WIDTH,
      estimateWidth(qApprMaxGlyphCount),
      measureText(qFallbackTitle),
    ), 0);
  }, [qMeasureInfo, estimateWidth, measureText, hasPseudoDimOnLeft]);

  const memoizedGetMeasureInfoWidth = useCallback(memoize((measureInfoIndex: number) => {
    const getWidth = (index: number, includeTitleWidth = true) => {
      const { qApprMaxGlyphCount, qFallbackTitle } = qMeasureInfo[index];
      const availableWidth = preCalcTotalDataColumnWidth >= rightGridWidth ? 0 : rightGridWidth;

      return Math.max(
        MIN_COLUMN_WIDTH,
        availableWidth / measureData.size.x,
        estimateWidth(qApprMaxGlyphCount),
        includeTitleWidth ? measureText(qFallbackTitle) : 0,
      );
    };

    if (hasPseudoDimOnLeft) {
      return Math.max(...qMeasureInfo.map((m, index) => getWidth(index, false)));
    }

    return getWidth(measureInfoIndex);
  }), [rightGridWidth, measureData.size.x, preCalcTotalDataColumnWidth, estimateWidth, measureText, qMeasureInfo, hasPseudoDimOnLeft]);

  const getDataColumnWidth = useCallback((colIndex: number) => {
    const measureInfoIndex = colIndex % qMeasureInfo.length;
    return memoizedGetMeasureInfoWidth(measureInfoIndex);
  }, [memoizedGetMeasureInfoWidth, qMeasureInfo]);

  const getTotalWidth = useCallback(() => Array
      .from({ length: measureData.size.x }, () => null)
      .reduce((width, _, index) => width + getDataColumnWidth(index), leftGridWidth),
    [getDataColumnWidth, leftGridWidth, measureData.size.x]
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
    getMeasureInfoWidth: memoizedGetMeasureInfoWidth,
    getTotalWidth
  };
}
