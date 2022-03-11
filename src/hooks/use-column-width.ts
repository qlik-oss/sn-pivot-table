import { useCallback, useMemo } from 'react';
import { PSEUDO_DIMENSION_INDEX } from '../constants';
import NxDimCellType from '../types/QIX';
import { DataModel, Rect } from '../types/types';
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

const MIN_COLUMN_WIDTH = 100;
const MAX_RATIO_OF_TOTAL_WIDTH = 0.75;

export default function useColumnWidth(dataModel: DataModel, rect: Rect): ColumnWidthHook {
  const { estimateWidth, measureText } = useMeasureText('13px', '"Source Sans Pro", sans-serif'); // TODO Hard-coded...
  const { getDimensionInfo, getMeasureInfo, pivotData } = dataModel;

  const hasPseudoDimOnLeft = useMemo(
    () => pivotData.left.some(column => column[0] !== null && (column[0] as EngineAPI.INxPivotDimensionCell).qType === NxDimCellType.NX_DIM_CELL_PSEUDO),
    [pivotData]
  );

  const leftColumnWidthsRatios = useMemo(() => {
    const ratios = pivotData.dimensionInfoIndexMap
      .reduce<number[]>((tmpRatios, dimIndex) => {
        if (dimIndex === PSEUDO_DIMENSION_INDEX) {
          const pseudoDimensionWidth = getMeasureInfo()
            .map(qMeasureInfo => qMeasureInfo.qFallbackTitle)
            .reduce((max, qFallbackTitle) => Math.max(max, measureText(qFallbackTitle)), 0);

          tmpRatios.push(pseudoDimensionWidth / rect.width);

          return tmpRatios;
        }

        const { qFallbackTitle, qApprMaxGlyphCount } = getDimensionInfo()[dimIndex];
        const w = Math.max(
          measureText(qFallbackTitle),
          estimateWidth(qApprMaxGlyphCount)
        );
        // const w = estimateWidth(getDimensionInfo()[dimIndex].qApprMaxGlyphCount);
        tmpRatios.push(w / rect.width);

        return tmpRatios;
      }, []);

    const sumOfRatios = ratios.reduce((sum, r) => sum + r, 0);
    if (sumOfRatios < MAX_RATIO_OF_TOTAL_WIDTH) return ratios;

    const multiplier = MAX_RATIO_OF_TOTAL_WIDTH / sumOfRatios;
    return ratios.map(r => r * multiplier);

  }, [estimateWidth, measureText, pivotData, getDimensionInfo, rect, getMeasureInfo]);

  const getLeftColumnWidth = useCallback(
    (index) => leftColumnWidthsRatios[index] * rect.width,
    [leftColumnWidthsRatios, rect]
  );

  const leftGridWidth = useMemo(
    () => pivotData.left.reduce((width, _, index) => width + getLeftColumnWidth(index), 0),
    [pivotData, getLeftColumnWidth]
  );

  const rightGridWidth = useMemo(
    () => Math.max(rect.width - leftGridWidth),
    [leftGridWidth, rect.width]
  );

  const preCalcTotalDataColumnWidth = useMemo(() => {
    const totalWidth = getMeasureInfo().reduce((width, qMeasureInfo) => {
      const { qApprMaxGlyphCount, qFallbackTitle } = qMeasureInfo;
      return width + Math.max(
        MIN_COLUMN_WIDTH,
        estimateWidth(qApprMaxGlyphCount),
        measureText(qFallbackTitle),
      );
    }, 0);

    return totalWidth;
  }, [getMeasureInfo, estimateWidth, measureText]);

  const getMeasureInfoWidth = useCallback((measureInfoIndex: number) => {
    const getWidth = (index: number) => {
      const { qApprMaxGlyphCount, qFallbackTitle } = getMeasureInfo()[index];
      const availableWidth = preCalcTotalDataColumnWidth >= rightGridWidth ? 0 : rightGridWidth;

      return Math.max(
        MIN_COLUMN_WIDTH,
        availableWidth / pivotData.size.data.x,
        estimateWidth(qApprMaxGlyphCount),
        measureText(qFallbackTitle),
      );
    };

    if (hasPseudoDimOnLeft) {
      return Math.max(...getMeasureInfo().map((info, index) => getWidth(index)));
    }

    return getWidth(measureInfoIndex);
  }, [rightGridWidth, pivotData, preCalcTotalDataColumnWidth, estimateWidth, measureText, getMeasureInfo, hasPseudoDimOnLeft]);

  const getDataColumnWidth = useCallback((colIndex: number) => {
    const measureInfoIndex = colIndex % getMeasureInfo().length;
    return getMeasureInfoWidth(measureInfoIndex);
  }, [getMeasureInfoWidth, getMeasureInfo]);

  const getTotalWidth = useCallback(() => Array
      .from({ length: pivotData.size.data.x }, () => null)
      .reduce((width, _, index) => width + getDataColumnWidth(index), leftGridWidth),
    [getDataColumnWidth, leftGridWidth, pivotData]
  );

  const totalMeasureInfoColumnWidth = useMemo(
    () => getMeasureInfo().reduce((width, _, index) => width + getDataColumnWidth(index), 0),
    [getMeasureInfo, getDataColumnWidth]
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
