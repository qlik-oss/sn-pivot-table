import { useMeasureText } from "@qlik/nebula-table-utils/lib/hooks";
import { useCallback, useMemo } from "react";
import { PSEUDO_DIMENSION_INDEX } from "../../constants";
import { ColumnWidthType, type ColumnWidth } from "../../types/QIX";
import type { CellStyling, LayoutService, Rect, VisibleDimensionInfo } from "../../types/types";
import { CELL_PADDING } from "../components/shared-styles";
import { GRID_BORDER, HEADER_ICON_SIZE } from "../constants";
import { useStyleContext } from "../contexts/StyleProvider";

interface ColumnWidthHook extends LeftGridWidthInfo {
  rightGridWidth: number;
  totalWidth: number;
  showLastRightBorder: boolean;
  getRightGridColumnWidth: (index?: number) => number;
  getHeaderCellsIconsVisibilityStatus: GetHeaderCellsIconsVisibilityStatus;
}

export interface GetHeaderCellsIconsVisibilityStatus {
  (
    idx: number,
    isLocked: boolean,
    title?: string,
  ): {
    shouldShowMenuIcon: boolean;
    shouldShowLockIcon: boolean;
  };
}

interface LeftGridWidthInfo {
  leftGridWidth: number;
  leftGridColumnWidths: number[];
}

export const EXPAND_ICON_WIDTH = 30;
export const TOTAL_CELL_PADDING = CELL_PADDING * 2 + GRID_BORDER;
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

const isBold = ({ fontWeight }: CellStyling) => fontWeight !== "normal";

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
  verticalScrollbarWidth: number,
  isEmptySpaceExistsBelowLastRow: boolean,
): ColumnWidthHook {
  const {
    layout: {
      qHyperCube: { qMeasureInfo, qNoOfLeftDims, qEffectiveInterColumnSortOrder },
    },
    isFullyExpanded,
    size,
  } = layoutService;
  const styleService = useStyleContext();
  const { measureText: measureTextForHeader } = useMeasureText({
    ...styleService.header,
    bold: isBold(styleService.header),
  });
  const { estimateWidth: estimateWidthForMeasureValue } = useMeasureText({
    ...styleService.measureValues,
    bold: isBold(styleService.measureValues),
  });
  const { estimateWidth: estimateWidthForDimensionValue, measureText: measureTextForDimensionValue } = useMeasureText({
    ...styleService.dimensionValues,
    bold: isBold(styleService.dimensionValues),
  });

  /**
   * The widths of the left columns. Scales the width to fit LEFT_SIDE_MAX_WIDTH_RATIO * rect.width if wider than that
   */
  const leftGridWidthInfo = useMemo<LeftGridWidthInfo>(() => {
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

    const columnWidths = visibleLeftDimensionInfo.map((qDimensionInfo, index) => {
      let width: number;

      if (qDimensionInfo === PSEUDO_DIMENSION_INDEX) {
        // Use the max width of all measures
        width = Math.max(
          ...qMeasureInfo.map(({ qFallbackTitle, columnWidth }) => {
            const fitToContentWidth = measureTextForDimensionValue(qFallbackTitle) + TOTAL_CELL_PADDING;
            return getColumnWidth(columnWidth, fitToContentWidth);
          }),
        );
      } else {
        const { qFallbackTitle, qApprMaxGlyphCount, columnWidth } = qDimensionInfo;
        const iconWidth = !isFullyExpanded && index < qNoOfLeftDims - 1 ? EXPAND_ICON_WIDTH : 0;
        const fitToContentWidth = Math.max(
          measureTextForHeader(qFallbackTitle) + TOTAL_CELL_PADDING,
          estimateWidthForDimensionValue(qApprMaxGlyphCount) + iconWidth,
        );

        width = getColumnWidth(columnWidth, fitToContentWidth);
      }

      sumOfWidths += width;
      return width;
    });

    return {
      leftGridWidth: Math.min(rect.width * LEFT_GRID_MAX_WIDTH_RATIO, sumOfWidths),
      leftGridColumnWidths: columnWidths,
    };
  }, [
    visibleLeftDimensionInfo,
    rect.width,
    qMeasureInfo,
    measureTextForDimensionValue,
    isFullyExpanded,
    qNoOfLeftDims,
    measureTextForHeader,
    estimateWidthForDimensionValue,
  ]);

  const getHeaderCellsIconsVisibilityStatus = useCallback<GetHeaderCellsIconsVisibilityStatus>(
    (idx, isLocked, title = "") => {
      const colWidth = leftGridWidthInfo.leftGridColumnWidths[idx];
      let shouldShowMenuIcon = false;
      let shouldShowLockIcon = false;
      const measuredTextForHeader = measureTextForHeader(title);

      // CELL_PADDING as grid gap between header text and menu icon
      const menuIconSize = CELL_PADDING + HEADER_ICON_SIZE;
      // CELL_PADDING as space between lock icon and header text
      const lockIconSize = CELL_PADDING + HEADER_ICON_SIZE;

      let headerSize = measuredTextForHeader + TOTAL_CELL_PADDING;
      if (isLocked && headerSize + lockIconSize <= colWidth) {
        shouldShowLockIcon = true;
        headerSize += lockIconSize;
      }
      if (headerSize + menuIconSize <= colWidth) {
        shouldShowMenuIcon = true;
      }

      return {
        shouldShowMenuIcon,
        shouldShowLockIcon,
      };
    },
    [leftGridWidthInfo, measureTextForHeader],
  );

  const rightGridAvailableWidth = useMemo(
    () => rect.width - leftGridWidthInfo.leftGridWidth - GRID_BORDER,
    [leftGridWidthInfo.leftGridWidth, rect.width],
  );

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
    const numberOfColumnRepetitions = size.x / columnArray.length;
    const widths: number[] = [];
    const autoColumnIndexes: number[] = [];
    let sumAutoWidths = rightGridAvailableWidth;

    const addKnownWidth = (idx: number, width: number) => {
      widths[idx] = Math.min(ColumnWidthValues.PixelsMax, Math.max(ColumnWidthValues.PixelsMin, width));
      // remove the width * number of instances of that column, from the remaining width for auto columns
      sumAutoWidths -= widths[idx] * numberOfColumnRepetitions;
    };

    columnArray.forEach((col, idx) => {
      if (col?.columnWidth) {
        const {
          columnWidth: { type, pixels, percentage },
          qApprMaxGlyphCount,
          qFallbackTitle,
        } = col;

        switch (type) {
          case ColumnWidthType.Pixels:
            addKnownWidth(idx, getPixelValue(pixels));
            break;
          case ColumnWidthType.Percentage:
            addKnownWidth(idx, getPercentageValue(percentage) * rightGridAvailableWidth);
            break;
          case ColumnWidthType.FitToContent:
            // eslint-disable-next-line no-case-declarations
            const fitToContentWidth = topGridLeavesIsPseudo
              ? Math.max(
                  estimateWidthForMeasureValue(qApprMaxGlyphCount),
                  measureTextForDimensionValue(qFallbackTitle) + TOTAL_CELL_PADDING,
                )
              : Math.max(
                  Math.max(...qMeasureInfo.map((m) => estimateWidthForMeasureValue(m.qApprMaxGlyphCount))),
                  estimateWidthForDimensionValue(qApprMaxGlyphCount) + leavesIconWidth,
                );
            addKnownWidth(idx, fitToContentWidth);
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
      // divides remaining width evenly between all auto column instances
      const numberOfAutoColumnInstances = autoColumnIndexes.length * numberOfColumnRepetitions;
      const autoWidth = sumAutoWidths / numberOfAutoColumnInstances;
      autoColumnIndexes.forEach((autoIdx) => {
        widths[autoIdx] = Math.max(ColumnWidthValues.AutoMin, autoWidth);
      });
    }

    return widths;
  }, [
    estimateWidthForDimensionValue,
    estimateWidthForMeasureValue,
    size.x,
    leafTopDimension,
    leavesIconWidth,
    measureTextForDimensionValue,
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

  /**
   * Gets the width of a right grid column. This is always based on the leaf width(s)
   */
  const getRightGridColumnWidth = useCallback(
    (index?: number) => {
      const scrollbarWidthSharePerColumn = !isEmptySpaceExistsBelowLastRow
        ? parseFloat((verticalScrollbarWidth / layoutService.size.x).toFixed(12))
        : 0;

      return topGridLeavesIsPseudo && index !== undefined
        ? leafWidths[layoutService.getMeasureInfoIndexFromCellIndex(index)] - scrollbarWidthSharePerColumn
        : averageLeafWidth - scrollbarWidthSharePerColumn;
    },
    [
      topGridLeavesIsPseudo,
      leafWidths,
      layoutService,
      averageLeafWidth,
      verticalScrollbarWidth,
      isEmptySpaceExistsBelowLastRow,
    ],
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
    () => leftGridWidthInfo.leftGridWidth + rightGridFullWidth + GRID_BORDER,
    [leftGridWidthInfo.leftGridWidth, rightGridFullWidth],
  );

  const showLastRightBorder = useMemo(() => totalWidth < rect.width, [totalWidth, rect.width]);

  return {
    ...leftGridWidthInfo,
    rightGridWidth,
    totalWidth,
    showLastRightBorder,
    getRightGridColumnWidth,
    getHeaderCellsIconsVisibilityStatus,
  };
}
