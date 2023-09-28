import { memoize } from "qlik-chart-modules";
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
  getLeftGridColumnWidth: (index: number) => number;
  getRightGridColumnWidth: (index?: number) => number;
}

export const EXPAND_ICON_WIDTH = 30;
const LEFT_GRID_MAX_WIDTH_RATIO = 0.75;

export enum ColumnWidthValues {
  PixelsMin = 30,
  PixelsMax = 7680,
  PixelsDefault = 200,
  PercentageMin = 1,
  PercentageMax = 100,
  PercentageDefault = 20,
  AutoMin = 80,
}

const getValidValue = (value: number | undefined, defaultValue: number) =>
  !!value && typeof value === "number" && !Number.isNaN(value) ? value : defaultValue;
const getPixelValue = (pixels: number | undefined) => getValidValue(pixels, ColumnWidthValues.PixelsDefault);
const getPercentageValue = (percentage: number | undefined) =>
  getValidValue(percentage, ColumnWidthValues.PercentageDefault) / 100;

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
   * The widths of the left columns. Scales the width to fit LEFT_SIDE_MAX_WIDTH_RATIO * rect.width if wider than that
   */
  const leftGridColumnWidths = useMemo(() => {
    const getColumnWidth = (columnWidth: ColumnWidth, fitToContentWidth: number) => {
      switch (columnWidth?.type) {
        case ColumnWidthType.Pixels:
          return getPixelValue(columnWidth.pixels);
        case ColumnWidthType.Percentage:
          return getPercentageValue(columnWidth.percentage) * rect.width;
        default:
          // fit to content / auto
          return fitToContentWidth;
      }
    };

    let sumOfWidths = 0;

    const widths = visibleLeftDimensionInfo.map((qDimensionInfo, index) => {
      let width;

      if (qDimensionInfo === PSEUDO_DIMENSION_INDEX) {
        // Use the max width of all measures
        width = Math.max(
          ...qMeasureInfo.map(({ qFallbackTitle, columnWidth }) => {
            const fitToContentWidth = measureTextForContent(qFallbackTitle);
            return getColumnWidth(columnWidth, fitToContentWidth);
          }),
        );
      } else {
        const { qFallbackTitle, qApprMaxGlyphCount, columnWidth } = qDimensionInfo;
        const fitToContentWidth = Math.max(
          measureTextForHeader(qFallbackTitle),
          estimateWidthForRowContent(qApprMaxGlyphCount) + getCollapseExpandIconSize(index),
        );

        width = getColumnWidth(columnWidth, fitToContentWidth);
      }

      sumOfWidths += width;
      return width;
    });

    const leftGridMaxWidth = rect.width * LEFT_GRID_MAX_WIDTH_RATIO;
    if (sumOfWidths < leftGridMaxWidth) return widths;

    const multiplier = leftGridMaxWidth / sumOfWidths;
    return widths.map((w) => w * multiplier);
  }, [
    visibleLeftDimensionInfo,
    measureTextForHeader,
    estimateWidthForRowContent,
    getCollapseExpandIconSize,
    rect.width,
    qMeasureInfo,
    measureTextForContent,
  ]);

  const getLeftGridColumnWidth = useCallback((index: number) => leftGridColumnWidths[index], [leftGridColumnWidths]);

  const leftGridWidth = useMemo(
    () => leftGridColumnWidths.reduce((totalWidth, w) => totalWidth + w, 0),
    [leftGridColumnWidths],
  );

  const rightGridAvailableWidth = useMemo(() => rect.width - leftGridWidth - GRID_BORDER, [leftGridWidth, rect.width]);

  /**
   * Get the width of a leaf in the top grid. If there is no top grid, early return rightGridAvailableWidth
   */
  const getLeafWidth = useCallback(
    (info: ExtendedDimensionInfo | ExtendedMeasureInfo | undefined) => {
      if (!info) return rightGridAvailableWidth;

      const { qApprMaxGlyphCount, qFallbackTitle, columnWidth } = info;
      const autoWidth = Math.max(rightGridAvailableWidth / layoutService.size.x, ColumnWidthValues.AutoMin);
      let specifiedWidth = 0;

      switch (columnWidth?.type) {
        case ColumnWidthType.Pixels: {
          specifiedWidth = getPixelValue(columnWidth.pixels);
          break;
        }
        case ColumnWidthType.Percentage: {
          specifiedWidth = getPercentageValue(columnWidth.percentage) * rightGridAvailableWidth;
          break;
        }
        case ColumnWidthType.FitToContent: {
          specifiedWidth = topGridLeavesIsPseudo
            ? Math.max(estimateWidthForContent(qApprMaxGlyphCount), measureTextForColumnContent(qFallbackTitle))
            : Math.max(
                Math.max(...qMeasureInfo.map((m) => estimateWidthForContent(m.qApprMaxGlyphCount))),
                estimateWidthForColumnContent(qApprMaxGlyphCount),
              );
          break;
        }
        case ColumnWidthType.Auto: {
          // TODO: we might need to redo this in the pseudo dimension case, since if not all measure are set to auto
          // you don't fill upp the width anyway
          specifiedWidth = autoWidth;
          break;
        }
        default:
          specifiedWidth = autoWidth;
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

  const averageLeafWidth = useMemo(() => {
    if (topGridLeavesIsPseudo) {
      const allMeasuresWidth = qMeasureInfo.reduce(
        (totalWidth, _, index) => totalWidth + getLeafWidth(qMeasureInfo[index]),
        0,
      );

      return allMeasuresWidth / qMeasureInfo.length;
    }
    return getLeafWidth(leafTopDimension);
  }, [topGridLeavesIsPseudo, getLeafWidth, leafTopDimension, qMeasureInfo]);

  const memoizedGetLeafWidth = useMemo(
    () => memoize((index: number) => getLeafWidth(qMeasureInfo[layoutService.getMeasureInfoIndexFromCellIndex(index)])),
    [qMeasureInfo, layoutService, getLeafWidth],
  );

  /**
   * Gets the width of a right grid column. This is always based on the leaf width(s)
   */
  const getRightGridColumnWidth = useCallback(
    (index?: number) => (topGridLeavesIsPseudo && index !== undefined ? memoizedGetLeafWidth(index) : averageLeafWidth),
    [topGridLeavesIsPseudo, memoizedGetLeafWidth, averageLeafWidth],
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
    getLeftGridColumnWidth,
    getRightGridColumnWidth,
  };
}
