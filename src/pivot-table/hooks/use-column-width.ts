import { memoize } from "qlik-chart-modules";
import { useCallback, useMemo } from "react";
import { PSEUDO_DIMENSION_INDEX } from "../../constants";
import type { LayoutService, LeftDimensionData, Rect, VisibleDimensionInfo } from "../../types/types";
import { GRID_BORDER } from "../constants";
import { useStyleContext } from "../contexts/StyleProvider";
import useMeasureText, { LEEWAY_WIDTH } from "./use-measure-text";

interface ColumnWidthHook {
  leftGridWidth: number;
  rightGridWidth: number;
  totalMeasureInfoColumnWidth: number;
  getLeftColumnWidth: (index: number) => number;
  getLeftColumnWidthMetadata: (idx: number, isLocked: boolean) => LeftColumnWidthMetadata;
  getDataColumnWidth: (index: number) => number;
  getMeasureInfoWidth: (index: number) => number;
  getTotalWidth: () => number;
}

export interface LeftColumnWidthMetadata {
  colWidth: number;
  shouldShowMenuIcon: boolean;
  shouldShowLockIcon: boolean;
}

export interface LeftColMetadata {
  qFallbackTitle: string;
  colWidth: number;
  ratio: number;
  measureTextForHeader: number;
  estimateWidthForContent: number;
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
    styleService.content,
  );
  const { measureText: measureTextForHeader } = useMeasureText(styleService.header);

  const hasPseudoDimOnLeft = useMemo(() => visibleLeftDimensionInfo.includes(-1), [visibleLeftDimensionInfo]);

  const leftColumnWidthMetadata = useMemo(() => {
    const metaData: LeftColMetadata[] = visibleLeftDimensionInfo.map((qDimensionInfo, index) => {
      if (qDimensionInfo === PSEUDO_DIMENSION_INDEX) {
        const pseudoDimensionWidth = Math.max(...qMeasureInfo.map((m) => measureTextForContent(m.qFallbackTitle)));
        return {
          qFallbackTitle: "PSEUDO_DIM",
          colWidth: pseudoDimensionWidth / rect.width,
          ratio: 1,
          measureTextForHeader: 0,
          estimateWidthForContent: 0,
        };
      }

      const { qFallbackTitle, qApprMaxGlyphCount } = qDimensionInfo;
      const hasChildNodes = index < qNoOfLeftDims - 1; // -1 as the last column can not be expanded or collapsed
      const collapseExpandIconSize = hasChildNodes ? EXPAND_ICON_WIDTH : 0;
      const w = Math.max(
        measureTextForHeader(qFallbackTitle),
        estimateWidthForContent(qApprMaxGlyphCount) + collapseExpandIconSize, // length of longest vlaue (replaced with m) + expand/collapse icon size
      );

      return {
        qFallbackTitle,
        colWidth: w,
        ratio: w / rect.width,
        measureTextForHeader: measureTextForHeader(qFallbackTitle),
        estimateWidthForContent: estimateWidthForContent(qApprMaxGlyphCount) + collapseExpandIconSize,
      };
    });

    // check ratios sum
    const sumOfRatios = metaData.reduce((sum, curr) => sum + curr.ratio, 0);
    if (sumOfRatios < MAX_RATIO_OF_TOTAL_WIDTH) return metaData;

    // adjust ratios sum
    const multiplier = MAX_RATIO_OF_TOTAL_WIDTH / sumOfRatios;
    return metaData.map((data) => ({
      ...data,
      ratio: data.ratio * multiplier,
      colWidth: data.ratio * multiplier * rect.width,
    }));
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
    (index: number) => {
      return leftColumnWidthMetadata[index].ratio * rect.width;
    },
    [leftColumnWidthMetadata, rect.width],
  );

  const getLeftColumnWidthMetadata = useCallback(
    (idx: number, isLocked: boolean): LeftColumnWidthMetadata => {
      const metaData = leftColumnWidthMetadata[idx];
      let shouldShowMenuIcon = true;
      let shouldShowLockIcon = true;

      // margin left + icon size
      const lockIconWidth = isLocked ? 8 + 12 : 0;
      // size + grid gap
      const menuIconWidth = 24 + 4;
      // 8px padding left, 4px padding right
      let finalSize = lockIconWidth + 8 + metaData.measureTextForHeader + 4 + menuIconWidth - LEEWAY_WIDTH;

      if (metaData.measureTextForHeader <= metaData.colWidth) {
        if (finalSize > metaData.colWidth) {
          // need this for next if check
          finalSize -= menuIconWidth;
          shouldShowMenuIcon = false;

          if (finalSize > metaData.colWidth) {
            shouldShowLockIcon = false;
          }
        }
      } else {
        shouldShowMenuIcon = false;
        shouldShowLockIcon = false;
      }

      return {
        colWidth: metaData.colWidth,
        shouldShowMenuIcon,
        shouldShowLockIcon,
      };
    },
    [leftColumnWidthMetadata],
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
    getLeftColumnWidthMetadata,
    getDataColumnWidth,
    getMeasureInfoWidth: memoizedGetMeasureInfoWidth,
    getTotalWidth,
  };
}
