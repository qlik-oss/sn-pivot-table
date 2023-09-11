import { useCallback, useMemo } from "react";
import { PSEUDO_DIMENSION_INDEX } from "../../constants";
import {
  ColumnWidthType,
  type ColumnWidth,
  type ExtendedDimensionInfo,
  type ExtendedMeasureInfo,
} from "../../types/QIX";
import type { LayoutService, Rect, VisibleDimensionInfo } from "../../types/types";
import { GRID_BORDER } from "../constants";
import { useStyleContext } from "../contexts/StyleProvider";
import useMeasureText from "./use-measure-text";

interface ColumnWidthHook {
  leftGridWidth: number;
  rightGridWidth: number;
  totalWidth: number;
  showLastRightBorder: boolean;
  getLeftColumnWidth: (index: number) => number;
  getLeafWidth: (index?: number) => number;
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

export default function useColumnWidth(
  layoutService: LayoutService,
  rect: Rect,
  visibleLeftDimensionInfo: VisibleDimensionInfo[],
  visibleTopDimensionInfo: VisibleDimensionInfo[],
): ColumnWidthHook {
  const {
    layout: {
      qHyperCube: { qMeasureInfo, qNoOfLeftDims },
    },
  } = layoutService;
  const styleService = useStyleContext();
  const { measureText: measureTextForHeader } = useMeasureText(styleService.header);
  const { estimateWidth: estimateWidthForRowContent } = useMeasureText(styleService.rowContent);
  const { measureText: measureTextForColumnContent, estimateWidth: estimateWidthForColumnContent } = useMeasureText(
    styleService.columnContent,
  );
  const { estimateWidth: estimateWidthForContent, measureText: measureTextForContent } = useMeasureText(
    styleService.content,
  );

  const leafTopDimension = visibleTopDimensionInfo.at(-1);
  const topGridLeavesIsPseudo = leafTopDimension === PSEUDO_DIMENSION_INDEX;

  const getCollapseExpandIconSize = useCallback(
    (index: number) => (index < qNoOfLeftDims - 1 ? EXPAND_ICON_WIDTH : 0),
    [qNoOfLeftDims],
  );

  /**
   * The ratios of the left column widths. Scales the ratios to fit MAX_RATIO_OF_TOTAL_WIDTH if wider than that
   */
  const leftColumnWidthsRatios = useMemo(() => {
    const getLeftColumnWidthRatio = (columnWidth: ColumnWidth, fitToContentWidth: number) => {
      switch (columnWidth?.type) {
        case ColumnWidthType.Pixels:
          return (columnWidth.pixels || ColumnWidthValues.PixelsDefault) / rect.width;
        case ColumnWidthType.Percentage:
          return (columnWidth?.percentage || ColumnWidthValues.PercentageDefault) / 100;
        default:
          // fit to content / auto
          return fitToContentWidth / rect.width;
      }
    };

    const ratios = visibleLeftDimensionInfo.map((qDimensionInfo, index) => {
      if (qDimensionInfo === PSEUDO_DIMENSION_INDEX) {
        // Use the max width of all measures
        const pseudoDimensionWidth = Math.max(
          ...qMeasureInfo.map(({ qFallbackTitle, columnWidth }) => {
            const fitToContentWidth = measureTextForContent(qFallbackTitle);
            return getLeftColumnWidthRatio(columnWidth, fitToContentWidth);
          }),
        );

        return pseudoDimensionWidth;
      }

      const { qFallbackTitle, qApprMaxGlyphCount, columnWidth } = qDimensionInfo;
      const fitToContentWidth = Math.max(
        measureTextForHeader(qFallbackTitle),
        estimateWidthForRowContent(qApprMaxGlyphCount) + getCollapseExpandIconSize(index),
      );

      return getLeftColumnWidthRatio(columnWidth, fitToContentWidth);
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
    // Don't remember what I meant with this?
    (index: number) => leftColumnWidthsRatios[index] * rect.width,
    [leftColumnWidthsRatios, rect.width],
  );

  const leftGridWidth = useMemo(
    () => visibleLeftDimensionInfo.reduce((width, _, index) => width + getLeftColumnWidth(index), 0),
    [visibleLeftDimensionInfo, getLeftColumnWidth],
  );

  const rightGridAvailableWidth = useMemo(() => rect.width - leftGridWidth - GRID_BORDER, [leftGridWidth, rect.width]);

  /**
   * Get the width of a right grid column. If there is no top grid, early return rightGridAvailableWidth
   */
  const getRightColumnWidth = useCallback(
    (info: ExtendedDimensionInfo | ExtendedMeasureInfo | undefined) => {
      if (!info) return rightGridAvailableWidth;

      const { qApprMaxGlyphCount, qFallbackTitle, columnWidth } = info;
      let specifiedWidth = 0;
      const autoWidth = rightGridAvailableWidth / layoutService.size.x;

      switch (columnWidth?.type) {
        case ColumnWidthType.Pixels: {
          specifiedWidth = columnWidth.pixels || ColumnWidthValues.PixelsDefault;
          break;
        }
        case ColumnWidthType.Percentage: {
          specifiedWidth =
            (rightGridAvailableWidth * (columnWidth?.percentage || ColumnWidthValues.PercentageDefault)) / 100;
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
              measureTextForColumnContent(qFallbackTitle),
            );
          } else {
            specifiedWidth = Math.max(
              Math.max(...qMeasureInfo.map((m) => estimateWidthForContent(m.qApprMaxGlyphCount))),
              estimateWidthForColumnContent(qApprMaxGlyphCount),
            );
          }
          break;
        }
        default:
          break;
      }

      return Math.max(ColumnWidthValues.PixelsMin, specifiedWidth);
    },
    [
      rightGridAvailableWidth,
      layoutService.size.x,
      topGridLeavesIsPseudo,
      estimateWidthForContent,
      measureTextForColumnContent,
      qMeasureInfo,
      estimateWidthForColumnContent,
    ],
  );

  /**
   * The width of each leaf, and for pseudo it is the average of all measure widths
   */
  const averageLeafWidth = useMemo(() => {
    if (topGridLeavesIsPseudo) {
      const allMeasuresWidth = qMeasureInfo.reduce(
        (totalWidth, _, index) => totalWidth + getRightColumnWidth(qMeasureInfo[index]),
        0,
      );

      return allMeasuresWidth / qMeasureInfo.length;
    }
    return getRightColumnWidth(leafTopDimension);
  }, [topGridLeavesIsPseudo, getRightColumnWidth, leafTopDimension, qMeasureInfo]);

  /**
   * Gets the average leaf width for the bottom row in the top grid
   * If the bottom row is measures and you pass an index for that measure, it will return the specific width for that measure
   */
  const getLeafWidth = useCallback(
    (index?: number) =>
      topGridLeavesIsPseudo && index !== undefined
        ? getRightColumnWidth(qMeasureInfo[layoutService.getMeasureInfoIndexFromCellIndex(index)])
        : averageLeafWidth,
    [topGridLeavesIsPseudo, getRightColumnWidth, qMeasureInfo, layoutService, averageLeafWidth],
  );

  // The width of the sum of all columns, can be smaller or greater than what fits in the chart
  const rightGridFullWidth = useMemo(
    () => layoutService.size.x * averageLeafWidth,
    [averageLeafWidth, layoutService.size.x],
  );

  // The width that will be assigned to the top and data grid
  const rightGridWidth = useMemo(
    () => Math.min(rightGridFullWidth, rightGridAvailableWidth),
    [rightGridFullWidth, rightGridAvailableWidth],
  );

  // The full scrollable width of the chart
  const totalWidth = useMemo(
    () => leftGridWidth + rightGridFullWidth + GRID_BORDER,
    [leftGridWidth, rightGridFullWidth],
  );

  const showLastRightBorder = useMemo(() => totalWidth < rect.width, [totalWidth, rect.width]);

  return {
    leftGridWidth,
    rightGridWidth,
    totalWidth,
    showLastRightBorder,
    getLeftColumnWidth,
    getLeafWidth,
  };
}
