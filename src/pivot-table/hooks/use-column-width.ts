import { memoize } from "qlik-chart-modules";
import { useCallback, useMemo } from "react";
import { PSEUDO_DIMENSION_INDEX } from "../../constants";
import type { LayoutService, LeftDimensionData, Rect, VisibleDimensionInfo } from "../../types/types";
import { GRID_BORDER } from "../constants";
import { useStyleContext } from "../contexts/StyleProvider";
import useMeasureText from "./use-measure-text";

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
  visibleLeftDimensionInfo: VisibleDimensionInfo[],
): ColumnWidthHook {
  const {
    size,
    layout: {
      qHyperCube: { qMeasureInfo, qNoOfLeftDims },
    },
  } = layoutService;
  const styleService = useStyleContext();
  const { estimateWidth: estimateWidthForContent, measureText: measureTextForContent } = useMeasureText(
    styleService.content.fontSize,
    styleService.content.fontFamily,
  );
  const { measureText: measureTextForHeader } = useMeasureText(
    styleService.header.fontSize,
    styleService.header.fontFamily,
  );

  const hasPseudoDimOnLeft = useMemo(() => visibleLeftDimensionInfo.includes(-1), [visibleLeftDimensionInfo]);

  const leftColumnWidthsRatios = useMemo(() => {
    const ratios = visibleLeftDimensionInfo.map((qDimensionInfo, index) => {
      if (qDimensionInfo === PSEUDO_DIMENSION_INDEX) {
        const pseudoDimensionWidth = Math.max(...qMeasureInfo.map((m) => measureTextForContent(m.qFallbackTitle)));

        return pseudoDimensionWidth / rect.width;
      }

      const { qFallbackTitle, qApprMaxGlyphCount } = qDimensionInfo;
      const hasChildNodes = index < qNoOfLeftDims - 1; // -1 as the last column can not be expanded or collapsed
      const collapseExpandIconSize = hasChildNodes ? EXPAND_ICON_WIDTH : 0;
      const w = Math.max(
        measureTextForHeader(qFallbackTitle),
        estimateWidthForContent(qApprMaxGlyphCount) + collapseExpandIconSize,
      );
      return w / rect.width;
    });

    const sumOfRatios = ratios.reduce((sum, r) => sum + r, 0);
    if (sumOfRatios < MAX_RATIO_OF_TOTAL_WIDTH) return ratios;

    const multiplier = MAX_RATIO_OF_TOTAL_WIDTH / sumOfRatios;
    return ratios.map((r) => r * multiplier);
  }, [
    estimateWidthForContent,
    measureTextForContent,
    measureTextForHeader,
    visibleLeftDimensionInfo,
    rect.width,
    qMeasureInfo,
    qNoOfLeftDims,
  ]);

  const getLeftColumnWidth = useCallback(
    (index: number) => leftColumnWidthsRatios[index] * rect.width,
    [leftColumnWidthsRatios, rect.width],
  );

  const leftGridWidth = useMemo(
    () => leftDimensionData.grid.reduce((width, _, index) => width + getLeftColumnWidth(index), 0),
    [leftDimensionData.grid, getLeftColumnWidth],
  );

  const rightGridWidth = useMemo(() => rect.width - leftGridWidth - GRID_BORDER, [leftGridWidth, rect.width]);
  const preCalcTotalDataColumnWidth = useMemo(() => {
    if (hasPseudoDimOnLeft) {
      return qMeasureInfo.reduce(
        (currentMaxWidth, { qApprMaxGlyphCount }) =>
          Math.max(currentMaxWidth, MIN_COLUMN_WIDTH, estimateWidthForContent(qApprMaxGlyphCount)),
        0,
      );
    }

    return qMeasureInfo.reduce(
      (width, { qApprMaxGlyphCount, qFallbackTitle }) =>
        width +
        Math.max(MIN_COLUMN_WIDTH, estimateWidthForContent(qApprMaxGlyphCount), measureTextForHeader(qFallbackTitle)),
      0,
    );
  }, [qMeasureInfo, estimateWidthForContent, measureTextForHeader, hasPseudoDimOnLeft]);

  const memoizedGetMeasureInfoWidth = useMemo(
    () =>
      memoize((measureInfoIndex: number) => {
        const getWidth = (index: number, includeTitleWidth = true) => {
          const { qApprMaxGlyphCount, qFallbackTitle } = qMeasureInfo[index];
          const availableWidth = preCalcTotalDataColumnWidth >= rightGridWidth ? 0 : rightGridWidth;

          return Math.max(
            MIN_COLUMN_WIDTH,
            availableWidth / size.x,
            estimateWidthForContent(qApprMaxGlyphCount),
            includeTitleWidth ? measureTextForHeader(qFallbackTitle) : 0,
          );
        };

        if (hasPseudoDimOnLeft) {
          return Math.max(...qMeasureInfo.map((m, index) => getWidth(index, false)));
        }

        return getWidth(measureInfoIndex);
      }),
    [
      rightGridWidth,
      size.x,
      preCalcTotalDataColumnWidth,
      estimateWidthForContent,
      measureTextForHeader,
      qMeasureInfo,
      hasPseudoDimOnLeft,
    ],
  );

  const getDataColumnWidth = useCallback(
    (colIndex: number) => {
      const measureInfoIndex = colIndex % qMeasureInfo.length;
      return memoizedGetMeasureInfoWidth(measureInfoIndex);
    },
    [memoizedGetMeasureInfoWidth, qMeasureInfo],
  );

  const getTotalWidth = useCallback(
    () =>
      Array.from({ length: size.x }, () => null).reduce(
        (width, _, index) => width + getDataColumnWidth(index),
        leftGridWidth,
      ),
    [getDataColumnWidth, leftGridWidth, size.x],
  );

  const totalMeasureInfoColumnWidth = useMemo(
    () => qMeasureInfo.reduce((width, _, index) => width + getDataColumnWidth(index), 0),
    [qMeasureInfo, getDataColumnWidth],
  );

  return {
    leftGridWidth,
    rightGridWidth,
    totalMeasureInfoColumnWidth,
    getLeftColumnWidth,
    getDataColumnWidth,
    getMeasureInfoWidth: memoizedGetMeasureInfoWidth,
    getTotalWidth,
  };
}
