import { memoize } from "qlik-chart-modules";
import { useCallback, useMemo } from "react";
import { PSEUDO_DIMENSION_INDEX } from "../../constants";
import type { LayoutService, LeftDimensionData, Rect } from "../../types/types";
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
  leafWidth: number;
  getTotalWidth: () => number;
}

export const EXPAND_ICON_WIDTH = 30;
const MIN_COLUMN_WIDTH = 30;
const MAX_RATIO_OF_TOTAL_WIDTH = 0.75;

export default function useColumnWidth(
  layoutService: LayoutService,
  rect: Rect,
  leftDimensionData: LeftDimensionData
): ColumnWidthHook {
  const styleService = useStyleContext();
  const { estimateWidth: estimateWidthForContent, measureText: measureTextForContent } = useMeasureText(
    styleService.content.fontSize,
    styleService.content.fontFamily
  );
  const { measureText: measureTextForHeader } = useMeasureText(
    styleService.header.fontSize,
    styleService.header.fontFamily
  );
  const { qDimensionInfo, qMeasureInfo, qNoOfLeftDims } = layoutService.layout.qHyperCube;

  const hasPseudoDimOnLeft = useMemo(
    () => leftDimensionData.dimensionInfoIndexMap.some((dimIndex) => dimIndex === PSEUDO_DIMENSION_INDEX),
    [leftDimensionData.dimensionInfoIndexMap]
  );

  const leftColumnWidthsRatios = useMemo(() => {
    const ratios = leftDimensionData.dimensionInfoIndexMap.map((dimIndex, index) => {
      if (dimIndex === PSEUDO_DIMENSION_INDEX) {
        const pseudoDimensionWidth = Math.max(...qMeasureInfo.map((m) => measureTextForContent(m.qFallbackTitle)));

        return pseudoDimensionWidth / rect.width;
      }

      const { qFallbackTitle, qApprMaxGlyphCount, columnWidth } = qDimensionInfo[dimIndex];
      if (columnWidth?.type === "pixels") {
        return (columnWidth.pixels || 200) / rect.width;
      }
      if (columnWidth?.type === "percentage") {
        return ((columnWidth?.percentage || 20) * MAX_RATIO_OF_TOTAL_WIDTH) / 100;
      }

      const hasChildNodes = index < qNoOfLeftDims - 1; // -1 as the last column can not be expanded or collapsed
      const collapseExpandIconSize = hasChildNodes ? EXPAND_ICON_WIDTH : 0;
      const w = Math.max(
        measureTextForHeader(qFallbackTitle),
        estimateWidthForContent(qApprMaxGlyphCount) + collapseExpandIconSize
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
    leftDimensionData.dimensionInfoIndexMap,
    rect.width,
    qDimensionInfo,
    qMeasureInfo,
    qNoOfLeftDims,
  ]);

  const getLeftColumnWidth = useCallback(
    (index: number) => leftColumnWidthsRatios[index] * rect.width,
    [leftColumnWidthsRatios, rect.width]
  );

  const leftGridWidth = useMemo(
    () => leftDimensionData.grid.reduce((width, _, index) => width + getLeftColumnWidth(index), 0),
    [leftDimensionData.grid, getLeftColumnWidth]
  );

  const rightGridWidth = useMemo(() => Math.max(rect.width - leftGridWidth - GRID_BORDER), [leftGridWidth, rect.width]);
  const preCalcTotalDataColumnWidth = useMemo(() => {
    if (hasPseudoDimOnLeft) {
      return qMeasureInfo.reduce(
        (currentMaxWidth, { qApprMaxGlyphCount }) =>
          Math.max(currentMaxWidth, MIN_COLUMN_WIDTH, estimateWidthForContent(qApprMaxGlyphCount)),
        0
      );
    }

    return qMeasureInfo.reduce(
      (width, { qApprMaxGlyphCount, qFallbackTitle }) =>
        width +
        Math.max(MIN_COLUMN_WIDTH, estimateWidthForContent(qApprMaxGlyphCount), measureTextForHeader(qFallbackTitle)),
      0
    );
  }, [qMeasureInfo, estimateWidthForContent, measureTextForHeader, hasPseudoDimOnLeft]);

  const memoizedGetMeasureInfoWidth = useMemo(
    () =>
      memoize((measureInfoIndex: number) => {
        const getWidth = (index: number, includeTitleWidth = true) => {
          const { qApprMaxGlyphCount, qFallbackTitle, columnWidth } = qMeasureInfo[index];
          const availableWidth = preCalcTotalDataColumnWidth >= rightGridWidth ? 0 : rightGridWidth;

          if (columnWidth?.type === "pixels") {
            const specifiedWidth = columnWidth.pixels || 200;
            return Math.max(MIN_COLUMN_WIDTH, specifiedWidth);
          }
          if (columnWidth?.type === "percentage") {
            const specifiedWidth = (rightGridWidth * (columnWidth?.percentage || 20)) / 100;
            return Math.max(MIN_COLUMN_WIDTH, specifiedWidth);
          }

          return Math.max(
            MIN_COLUMN_WIDTH,
            availableWidth / layoutService.size.x,
            estimateWidthForContent(qApprMaxGlyphCount),
            includeTitleWidth ? measureTextForHeader(qFallbackTitle) : 0
          );
        };

        if (hasPseudoDimOnLeft) {
          return Math.max(...qMeasureInfo.map((m, index) => getWidth(index, false)));
        }

        return getWidth(measureInfoIndex);
      }),
    [
      rightGridWidth,
      layoutService.size.x,
      preCalcTotalDataColumnWidth,
      estimateWidthForContent,
      measureTextForHeader,
      qMeasureInfo,
      hasPseudoDimOnLeft,
    ]
  );

  const leafWidth = useMemo(() => {
    const sortOrder = layoutService.layout.qHyperCube.qEffectiveInterColumnSortOrder;
    const lastIndex = sortOrder[sortOrder.length - 1];

    if (lastIndex === -1) {
      const allMeasuresWidth = qMeasureInfo.reduce(
        (totalWidth, measure, index) => totalWidth + memoizedGetMeasureInfoWidth(index),
        0
      );

      return allMeasuresWidth / qMeasureInfo.length;
    }

    const { columnWidth, qApprMaxGlyphCount } = qDimensionInfo[lastIndex];
    if (columnWidth?.type === "pixels") {
      const specifiedWidth = columnWidth.pixels || 200;
      return Math.max(MIN_COLUMN_WIDTH, specifiedWidth);
    }
    if (columnWidth?.type === "percentage") {
      const specifiedWidth = (rightGridWidth * (columnWidth?.percentage || 20)) / 100;
      return Math.max(MIN_COLUMN_WIDTH, specifiedWidth);
    }
    const availableWidth = preCalcTotalDataColumnWidth >= rightGridWidth ? 0 : rightGridWidth;

    return Math.max(
      MIN_COLUMN_WIDTH,
      availableWidth / layoutService.size.x,
      estimateWidthForContent(qApprMaxGlyphCount)
    );

    // if (hasPseudoDimOnLeft) {
    //   return Math.max(...qMeasureInfo.map((m, index) => getWidth(index, false)));
    // }
  }, [
    layoutService.layout.qHyperCube.qEffectiveInterColumnSortOrder,
    layoutService.size.x,
    qDimensionInfo,
    preCalcTotalDataColumnWidth,
    rightGridWidth,
    estimateWidthForContent,
    qMeasureInfo,
    memoizedGetMeasureInfoWidth,
  ]);

  const getDataColumnWidth = useCallback(
    (colIndex: number) => {
      const measureInfoIndex = colIndex % qMeasureInfo.length;
      return memoizedGetMeasureInfoWidth(measureInfoIndex);
    },
    [memoizedGetMeasureInfoWidth, qMeasureInfo]
  );

  const getTotalWidth = useCallback(
    () =>
      Array.from({ length: layoutService.size.x }, () => null).reduce(
        (width, _, index) => width + getDataColumnWidth(index),
        leftGridWidth
      ),
    [getDataColumnWidth, leftGridWidth, layoutService.size.x]
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
    leafWidth,
    getTotalWidth,
  };
}
