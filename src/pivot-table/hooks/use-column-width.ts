import { memoize } from "qlik-chart-modules";
import { useCallback, useMemo } from "react";
import { PSEUDO_DIMENSION_INDEX } from "../../constants";
import { ColumnWidthType, type ExtendedNxDimensionInfo, type ExtendedNxMeasureInfo } from "../../types/QIX";
import type {
  DimensionContentStyling,
  HeaderStyling,
  LayoutService,
  LeftDimensionData,
  MeasureContentStyling,
  Rect,
  TopDimensionData,
  VisibleDimensionInfo,
} from "../../types/types";
import { GRID_BORDER } from "../constants";
import { useStyleContext } from "../contexts/StyleProvider";
import useMeasureText from "./use-measure-text";

interface ColumnWidthHook {
  leftGridWidth: number;
  rightGridWidth: number;
  getLeftColumnWidth: (index: number) => number;
  getMeasureInfoWidth: (index: number) => number;
  getLeafWidth: (index?: number) => number;
  totalWidth: number;
  showRightBorder: boolean;
}

export const EXPAND_ICON_WIDTH = 30;
const MAX_RATIO_OF_TOTAL_WIDTH = 0.75;

export enum ColumnWidthValues {
  PixelsMin = 30,
  PixelsMax = 7680,
  PixelsDefault = 200,
  PercentageMin = 1,
  PercentageMax = 100,
  PercentageDefault = 20,
}

// TODO: refactor and move this to use-measure-text file
const useMeasureAndEstimate = (styling: HeaderStyling | MeasureContentStyling | DimensionContentStyling) =>
  useMeasureText(styling["fontSize"], styling["fontFamily"]);

export default function useColumnWidth(
  layoutService: LayoutService,
  rect: Rect,
  visibleLeftDimensionInfo: VisibleDimensionInfo[],
  visibleTopDimensionInfo: VisibleDimensionInfo[]
): ColumnWidthHook {
  const {
    layout: {
      qHyperCube: { qMeasureInfo, qNoOfLeftDims },
    },
  } = layoutService;
  const styleService = useStyleContext();
  const { measureText: measureTextForHeader } = useMeasureAndEstimate(styleService.header);
  const { estimateWidth: estimateWidthForRowContent } = useMeasureAndEstimate(styleService.rowContent);
  const { measureText: measureTextForColumnContent, estimateWidth: estimateWidthForColumnContent } =
    useMeasureAndEstimate(styleService.columnContent);
  const { estimateWidth: estimateWidthForContent, measureText: measureTextForContent } = useMeasureAndEstimate(
    styleService.content
  );

  const leafTopDimension = visibleTopDimensionInfo.at(-1);
  const topGridLeavesIsPseudo = leafTopDimension === PSEUDO_DIMENSION_INDEX;

  const getCollapseExpandIconSize = useCallback(
    (index: number) => (index < qNoOfLeftDims - 1 ? EXPAND_ICON_WIDTH : 0),
    [qNoOfLeftDims]
  );

  const hasPseudoDimOnLeft = useMemo(() => visibleLeftDimensionInfo.includes(-1), [visibleLeftDimensionInfo]);

  const leftColumnWidthsRatios = useMemo(() => {
    const ratios = visibleLeftDimensionInfo.map((qDimensionInfo, index) => {
      if (qDimensionInfo === PSEUDO_DIMENSION_INDEX) {
        const pseudoDimensionWidth = Math.max(...qMeasureInfo.map((m) => measureTextForContent(m.qFallbackTitle)));

        return pseudoDimensionWidth / rect.width;
      }

      const { qFallbackTitle, qApprMaxGlyphCount, columnWidth } = qDimensionInfo;

      if (columnWidth?.type === ColumnWidthType.Pixels) {
        return (columnWidth.pixels || ColumnWidthValues.PixelsDefault) / rect.width;
      }

      if (columnWidth?.type === ColumnWidthType.Percentage) {
        // TODO: do we want the percentage value to represent the entire chart or just the 75% that you can occupy with the left side
        return ((columnWidth?.percentage || ColumnWidthValues.PercentageDefault) * MAX_RATIO_OF_TOTAL_WIDTH) / 100;
      }

      // fit to content
      const w = Math.max(
        measureTextForHeader(qFallbackTitle),
        estimateWidthForRowContent(qApprMaxGlyphCount) + getCollapseExpandIconSize(index)
      );
      return w / rect.width;

      // TODO: What does auto mean in this case? there is not width that things can fit to.
      // You could do 75% but that is not a very useful case
    });

    const sumOfRatios = ratios.reduce((sum, r) => sum + r, 0);
    if (sumOfRatios < MAX_RATIO_OF_TOTAL_WIDTH) return ratios;

    const multiplier = MAX_RATIO_OF_TOTAL_WIDTH / sumOfRatios;
    return ratios.map((r) => r * multiplier);
  }, [
    visibleLeftDimensionInfo,
    measureTextForHeader,
    estimateWidthForRowContent,
    getCollapseExpandIconSize,
    rect.width,
    qMeasureInfo,
    measureTextForContent,
  ]);

  const getLeftColumnWidth = useCallback(
    // TODO: There is no minimum check here, need to do it in a smart way to not make the left grid too wide
    (index: number) => leftColumnWidthsRatios[index] * rect.width,
    [leftColumnWidthsRatios, rect.width]
  );

  const leftGridWidth = useMemo(
    () => visibleLeftDimensionInfo.reduce((width, _, index) => width + getLeftColumnWidth(index), 0),
    [visibleLeftDimensionInfo, getLeftColumnWidth]
  );

  const rightGridWidth = useMemo(() => Math.max(rect.width - leftGridWidth - GRID_BORDER), [leftGridWidth, rect.width]);

  const getWidth = useCallback(
    (info: ExtendedNxDimensionInfo | ExtendedNxMeasureInfo | undefined, includeTitleWidth = true) => {
      const { qApprMaxGlyphCount, qFallbackTitle, columnWidth } = info ?? ({} as ExtendedNxDimensionInfo);
      let specifiedWidth: number;
      const autoWidth = rightGridWidth / layoutService.size.x;

      switch (columnWidth?.type) {
        case ColumnWidthType.Pixels: {
          specifiedWidth = columnWidth.pixels || ColumnWidthValues.PixelsDefault;
          break;
        }
        case ColumnWidthType.Percentage: {
          specifiedWidth = (rightGridWidth * (columnWidth?.percentage || ColumnWidthValues.PercentageDefault)) / 100;
          break;
        }
        case ColumnWidthType.Auto: {
          // TODO: we might need to redo this in the pseudo dimension case, since if not all measure are set to auto
          // you don't fill upp the width anyway
          specifiedWidth = autoWidth;
          break;
        }
        case ColumnWidthType.FitToContent: {
          if (topGridLeavesIsPseudo) {
            specifiedWidth = Math.max(
              estimateWidthForContent(qApprMaxGlyphCount),
              includeTitleWidth ? measureTextForColumnContent(qFallbackTitle) : 0
            );
          } else {
            specifiedWidth = Math.max(
              Math.max(...qMeasureInfo.map((m) => estimateWidthForContent(m.qApprMaxGlyphCount))),
              estimateWidthForColumnContent(qApprMaxGlyphCount)
            );
          }
          break;
        }
        default:
          specifiedWidth = 0;
          break;
      }

      return Math.max(ColumnWidthValues.PixelsMin, specifiedWidth);
    },
    [
      rightGridWidth,
      layoutService.size.x,
      topGridLeavesIsPseudo,
      estimateWidthForContent,
      measureTextForColumnContent,
      qMeasureInfo,
      estimateWidthForColumnContent,
    ]
  );

  const memoizedGetMeasureInfoWidth = useMemo(
    () =>
      memoize((measureInfoIndex: number) => {
        if (hasPseudoDimOnLeft) {
          return Math.max(...qMeasureInfo.map((m) => getWidth(m, false)));
        }

        return getWidth(qMeasureInfo[measureInfoIndex]);
      }),
    [getWidth, hasPseudoDimOnLeft, qMeasureInfo]
  );

  const averageLeafWidth = useMemo(() => {
    if (topGridLeavesIsPseudo) {
      const allMeasuresWidth = qMeasureInfo.reduce(
        (totalWidth, _, index) => totalWidth + memoizedGetMeasureInfoWidth(index),
        0
      );

      return allMeasuresWidth / qMeasureInfo.length;
    }
    return getWidth(leafTopDimension);
  }, [topGridLeavesIsPseudo, getWidth, leafTopDimension, qMeasureInfo, memoizedGetMeasureInfoWidth]);

  const getLeafWidth = useCallback(
    /**
     * Gets the average leaf width for the bottom row in the top grid
     * If the bottom row is measures and you pass an index for that measure, it will return the specific width for that measure
     */
    (index?: number) =>
      topGridLeavesIsPseudo && index !== undefined
        ? memoizedGetMeasureInfoWidth(layoutService.getMeasureInfoIndexFromCellIndex(index))
        : averageLeafWidth,
    [averageLeafWidth, layoutService, memoizedGetMeasureInfoWidth, topGridLeavesIsPseudo]
  );

  const totalWidth = useMemo(
    () => leftGridWidth + layoutService.size.x * averageLeafWidth,
    [averageLeafWidth, leftGridWidth, layoutService.size.x]
  );

  const showRightBorder = useMemo(() => totalWidth < layoutService.size.x, [totalWidth, layoutService.size.x]);

  return {
    leftGridWidth,
    rightGridWidth,
    getLeftColumnWidth,
    getMeasureInfoWidth: memoizedGetMeasureInfoWidth,
    getLeafWidth,
    totalWidth,
    showRightBorder,
  };
}
