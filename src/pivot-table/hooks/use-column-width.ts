import { useMeasureText } from "@qlik/nebula-table-utils/lib/hooks";
import { memoize } from "qlik-chart-modules";
import { useCallback, useMemo } from "react";
import { PSEUDO_DIMENSION_INDEX } from "../../constants";
import { ColumnWidthType, type ColumnWidth } from "../../types/QIX";
import type { LayoutService, Rect, VisibleDimensionInfo } from "../../types/types";
import { GRID_BORDER } from "../constants";
import { useStyleContext } from "../contexts/StyleProvider";

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
      qHyperCube: { qMeasureInfo, qNoOfLeftDims, qEffectiveInterColumnSortOrder },
    },
    isFullyExpanded,
    size,
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
        const iconWidth = !isFullyExpanded && index < qNoOfLeftDims - 1 ? EXPAND_ICON_WIDTH : 0;
        const fitToContentWidth = Math.max(
          measureTextForHeader(qFallbackTitle),
          estimateWidthForRowContent(qApprMaxGlyphCount) + iconWidth,
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
    rect.width,
    qMeasureInfo,
    measureTextForContent,
    isFullyExpanded,
    qNoOfLeftDims,
    measureTextForHeader,
    estimateWidthForRowContent,
  ]);

  const getLeftGridColumnWidth = useCallback((index: number) => leftGridColumnWidths[index], [leftGridColumnWidths]);

  const leftGridWidth = useMemo(
    () => leftGridColumnWidths.reduce((totalWidth, w) => totalWidth + w, 0),
    [leftGridColumnWidths],
  );

  const rightGridAvailableWidth = useMemo(() => rect.width - leftGridWidth - GRID_BORDER, [leftGridWidth, rect.width]);

  const leafTopDimension = visibleTopDimensionInfo.at(-1);
  const topGridLeavesIsPseudo = leafTopDimension === PSEUDO_DIMENSION_INDEX;
  const leavesIconWidth =
    qEffectiveInterColumnSortOrder.length - qNoOfLeftDims > visibleTopDimensionInfo.length ? EXPAND_ICON_WIDTH : 0;

  /**
   * Contains the unique column width values
   * For a dimension, this is just one value, which every column will use
   * For measures this means one value for each measure.
   */
  const leafWidths = useMemo(() => {
    const columnArray = topGridLeavesIsPseudo ? qMeasureInfo : [leafTopDimension];
    const widths: number[] = [];
    const autoColumnIndexes: number[] = [];
    let sumAutoWidths = rightGridAvailableWidth;

    columnArray.forEach((col, idx) => {
      if (col?.columnWidth) {
        const {
          columnWidth: { type, pixels, percentage },
          qApprMaxGlyphCount,
          qFallbackTitle,
        } = col;

        const addKnownWidth = (width: number) => {
          widths[idx] = Math.min(ColumnWidthValues.PixelsMax, Math.max(ColumnWidthValues.PixelsMin, width));
          // remove the width * number of instances of that width from the remaining width for auto columns
          sumAutoWidths -= widths[idx] * (size.x / columnArray.length);
        };

        switch (type) {
          case ColumnWidthType.Pixels:
            addKnownWidth(getPixelValue(pixels));
            break;
          case ColumnWidthType.Percentage:
            addKnownWidth(getPercentageValue(percentage) * rightGridAvailableWidth);
            break;
          case ColumnWidthType.FitToContent:
            // eslint-disable-next-line no-case-declarations
            const fitToContentWidth = topGridLeavesIsPseudo
              ? Math.max(estimateWidthForContent(qApprMaxGlyphCount), measureTextForColumnContent(qFallbackTitle))
              : Math.max(
                  Math.max(...qMeasureInfo.map((m) => estimateWidthForContent(m.qApprMaxGlyphCount))),
                  estimateWidthForColumnContent(qApprMaxGlyphCount) + leavesIconWidth,
                );
            addKnownWidth(fitToContentWidth);
            break;
          case ColumnWidthType.Auto:
          default:
            // stores the indexes of auto columns to loop over later
            autoColumnIndexes.push(idx);
            break;
        }
      } else {
        autoColumnIndexes.push(idx);
      }
    });

    if (autoColumnIndexes.length) {
      // divides remaining width evenly between auto columns
      const totalNumberOfAutoColumns = (size.x * autoColumnIndexes.length) / columnArray.length;
      const autoWidth = sumAutoWidths / totalNumberOfAutoColumns;
      autoColumnIndexes.forEach((autoIdx) => {
        widths[autoIdx] = Math.max(ColumnWidthValues.AutoMin, autoWidth);
      });
    }

    return widths;
  }, [
    estimateWidthForColumnContent,
    estimateWidthForContent,
    size.x,
    leafTopDimension,
    leavesIconWidth,
    measureTextForColumnContent,
    qMeasureInfo,
    rightGridAvailableWidth,
    topGridLeavesIsPseudo,
  ]);

  const averageLeafWidth = useMemo(() => {
    if (topGridLeavesIsPseudo) {
      const allMeasuresWidth = qMeasureInfo.reduce((totalWidth, _, index) => totalWidth + leafWidths[index], 0);
      return allMeasuresWidth / qMeasureInfo.length;
    }

    return leafWidths[0];
  }, [topGridLeavesIsPseudo, leafWidths, qMeasureInfo]);

  const memoizedGetLeafWidth = useMemo(
    () => memoize((index: number) => leafWidths[layoutService.getMeasureInfoIndexFromCellIndex(index)]),
    [layoutService, leafWidths],
  );

  /**
   * Gets the width of a right grid column. This is always based on the leaf width(s)
   */
  const getRightGridColumnWidth = useCallback(
    (index?: number) => (topGridLeavesIsPseudo && index !== undefined ? memoizedGetLeafWidth(index) : averageLeafWidth),
    [topGridLeavesIsPseudo, memoizedGetLeafWidth, averageLeafWidth],
  );

  // The width of the sum of all columns, can be smaller or greater than what fits in the chart
  const rightGridFullWidth = useMemo(() => size.x * averageLeafWidth, [averageLeafWidth, size.x]);

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
