import { memoize } from "qlik-chart-modules";
import { useCallback, useMemo } from "react";
import { PSEUDO_DIMENSION_INDEX } from "../../constants";
import { ColumnWidthType } from "../../types/QIX";
import type { LayoutService, LeftDimensionData, Rect, TopDimensionData } from "../../types/types";
import { GRID_BORDER } from "../constants";
import { useStyleContext } from "../contexts/StyleProvider";
import useMeasureText from "./use-measure-text";

interface ColumnWidthHook {
  leftGridWidth: number;
  rightGridWidth: number;
  // totalMeasureInfoColumnWidth: number;
  getLeftColumnWidth: (index: number) => number;
  // getDataColumnWidth: (index: number) => number;
  getMeasureInfoWidth: (index: number) => number;
  leafWidth: number;
  // getTotalWidth: () => number;
  totalWidth: number;
  showRightBorder: boolean;
}

export const EXPAND_ICON_WIDTH = 30;
const MIN_COLUMN_WIDTH = 30;
const MAX_RATIO_OF_TOTAL_WIDTH = 0.75;
const DEFAULT_PIXEL_VALUE = 200;
const DEFAULT_PERCENTAGE_VALUE = 20;

export default function useColumnWidth(
  layoutService: LayoutService,
  rect: Rect,
  leftDimensionData: LeftDimensionData,
  topGridLeafIndex: number
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
      // percentage
      if (columnWidth?.type === "pixels") {
        return (columnWidth.pixels || DEFAULT_PIXEL_VALUE) / rect.width;
      }
      // pixels
      if (columnWidth?.type === "percentage") {
        // TODO: do we want the percentage value to represent the entire chart or just the 75 precent that you can occupy with the left side
        return ((columnWidth?.percentage || DEFAULT_PERCENTAGE_VALUE) * MAX_RATIO_OF_TOTAL_WIDTH) / 100;
      }

      // fit to content
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

  const memoizedGetMeasureInfoWidth = useMemo(
    () =>
      memoize((measureInfoIndex: number) => {
        // TODO: getWidth is exactly what we do for the dimensions as well, should be able to extract this
        const getWidth = (index: number, includeTitleWidth = true) => {
          const { qApprMaxGlyphCount, qFallbackTitle, columnWidth } = qMeasureInfo[index];
          let specifiedWidth: number;

          switch (columnWidth?.type) {
            case ColumnWidthType.Pixels: {
              specifiedWidth = columnWidth.pixels || DEFAULT_PIXEL_VALUE;
              break;
            }
            case ColumnWidthType.Percentage: {
              specifiedWidth = (rightGridWidth * (columnWidth?.percentage || DEFAULT_PERCENTAGE_VALUE)) / 100;
              break;
            }
            case ColumnWidthType.Auto: {
              specifiedWidth = rightGridWidth / layoutService.size.x;
              break;
            }
            case ColumnWidthType.FitToContent: {
              specifiedWidth = Math.max(
                estimateWidthForContent(qApprMaxGlyphCount),
                includeTitleWidth ? measureTextForHeader(qFallbackTitle) : 0
              );
              break;
            }
            default:
              // TODO ERROR HANDLING
              specifiedWidth = 0;
              break;
          }

          return Math.max(MIN_COLUMN_WIDTH, specifiedWidth);
        };

        if (hasPseudoDimOnLeft) {
          // TODO: look into why this is excluding the title width, shouldn't it only depend on the title?
          return Math.max(...qMeasureInfo.map((m, index) => getWidth(index, false)));
        }

        return getWidth(measureInfoIndex);
      }),
    [
      rightGridWidth,
      layoutService.size.x,
      estimateWidthForContent,
      measureTextForHeader,
      qMeasureInfo,
      hasPseudoDimOnLeft,
    ]
  );

  const leafWidth = useMemo(() => {
    const leavesAreMeasures = topGridLeafIndex === -1;

    if (leavesAreMeasures) {
      const allMeasuresWidth = qMeasureInfo.reduce(
        (totalWidth, measure, index) => totalWidth + memoizedGetMeasureInfoWidth(index),
        0
      );

      return allMeasuresWidth / qMeasureInfo.length;
    }

    const { columnWidth, qApprMaxGlyphCount, qFallbackTitle } = qDimensionInfo[topGridLeafIndex];
    let specifiedWidth: number;

    switch (columnWidth?.type) {
      case ColumnWidthType.Pixels: {
        specifiedWidth = columnWidth.pixels || DEFAULT_PIXEL_VALUE;
        break;
      }
      case ColumnWidthType.Percentage: {
        specifiedWidth = (rightGridWidth * (columnWidth?.percentage || DEFAULT_PERCENTAGE_VALUE)) / 100;
        break;
      }
      case ColumnWidthType.Auto: {
        specifiedWidth = rightGridWidth / layoutService.size.x;
        break;
      }
      case ColumnWidthType.FitToContent: {
        specifiedWidth = Math.max(estimateWidthForContent(qApprMaxGlyphCount), measureTextForHeader(qFallbackTitle));
        break;
      }
      default:
        // TODO ERROR HANDLING
        specifiedWidth = 0;
        break;
    }

    // TODO: compensate for padding and icon?
    return Math.max(MIN_COLUMN_WIDTH, specifiedWidth);
  }, [
    topGridLeafIndex,
    qDimensionInfo,
    qMeasureInfo,
    memoizedGetMeasureInfoWidth,
    rightGridWidth,
    layoutService.size.x,
    estimateWidthForContent,
    measureTextForHeader,
  ]);

  const totalWidth = useMemo(
    () => leftGridWidth + layoutService.size.x * leafWidth,
    [leafWidth, leftGridWidth, layoutService.size.x]
  );

  const showRightBorder = useMemo(() => totalWidth < layoutService.size.x, [totalWidth, layoutService.size.x]);

  console.log("leafWidth", leafWidth);

  return {
    leftGridWidth,
    rightGridWidth,
    getLeftColumnWidth,
    getMeasureInfoWidth: memoizedGetMeasureInfoWidth,
    leafWidth,
    totalWidth,
    showRightBorder,
  };
}
