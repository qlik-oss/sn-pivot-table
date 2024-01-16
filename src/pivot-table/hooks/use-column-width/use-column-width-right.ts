import { ColumnWidthType, ColumnWidthValues } from "@qlik/nebula-table-utils/lib/constants";
import { useMeasureText } from "@qlik/nebula-table-utils/lib/hooks";
import { useCallback, useMemo } from "react";
import { PSEUDO_DIMENSION_INDEX } from "../../../constants";
import { GRID_BORDER } from "../../constants";
import { useStyleContext } from "../../contexts/StyleProvider";
import { EXPAND_ICON_SIZE, TOTAL_CELL_PADDING } from "./constants";
import type { ColumnWidthRightHook } from "./types";
import { getMeasureTextArgs, getPercentageValue, getPixelValue } from "./utils";

export default function useColumnWidthRight({
  layoutService,
  tableWidth,
  visibleTopDimensionInfo,
  verticalScrollbarWidth,
  leftGridWidth,
}: ColumnWidthRightHook) {
  const {
    layout: {
      qHyperCube: { qNoOfLeftDims, qEffectiveInterColumnSortOrder },
    },
    size,
    visibleMeasureInfo,
  } = layoutService;
  const styleService = useStyleContext();
  const { estimateWidth: estimateWidthForMeasureValue, measureText: measureTextForMeasureValue } = useMeasureText(
    getMeasureTextArgs(styleService.measureValues),
  );
  const { estimateWidth: estimateWidthForDimensionValue } = useMeasureText(
    getMeasureTextArgs(styleService.dimensionValues),
  );

  /**
   * Calculates widths of the left columns as well as the sum of the widths.
   * If the sum of widths exceed LEFT_SIDE_MAX_WIDTH_RATIO * tableWidth, the left side will become scrollable
   */
  const rightGridAvailableWidth = tableWidth - leftGridWidth - GRID_BORDER;

  const leafTopDimension = visibleTopDimensionInfo.at(-1);
  const topGridLeavesIsPseudo = leafTopDimension === PSEUDO_DIMENSION_INDEX;
  const leavesIconWidth =
    qEffectiveInterColumnSortOrder.length - qNoOfLeftDims > visibleTopDimensionInfo.length ? EXPAND_ICON_SIZE : 0;

  /**
   * Contains the unique column width values
   * For a dimension, this is just one value, which every column will use
   * For measures this means one value for each measure.
   */
  const leafWidths = useMemo(() => {
    const columnArray = topGridLeavesIsPseudo ? visibleMeasureInfo : [leafTopDimension];
    const numberOfColumnRepetitions = size.x / columnArray.length;
    const widths: number[] = [];
    const autoColumnIndexes: number[] = [];
    let sumAutoWidths = rightGridAvailableWidth;

    const addKnownWidth = (idx: number, width: number) => {
      widths[idx] = Math.min(ColumnWidthValues.PixelsMax, Math.max(ColumnWidthValues.PixelsMin, width));
      // remove the width * number of instances of that column, from the remaining width for auto columns
      sumAutoWidths -= widths[idx] * numberOfColumnRepetitions;
    };

    const fitToContentWidth = (qApprMaxGlyphCount: number, qFallbackTitle: string) =>
      TOTAL_CELL_PADDING +
      (topGridLeavesIsPseudo
        ? Math.max(estimateWidthForMeasureValue(qApprMaxGlyphCount), measureTextForMeasureValue(qFallbackTitle))
        : Math.max(
            Math.max(...visibleMeasureInfo.map((m) => estimateWidthForMeasureValue(m.qApprMaxGlyphCount))),
            estimateWidthForDimensionValue(qApprMaxGlyphCount) + leavesIconWidth,
          ));

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
            addKnownWidth(idx, getPercentageValue(percentage, rightGridAvailableWidth));
            break;
          case ColumnWidthType.FitToContent:
            addKnownWidth(idx, fitToContentWidth(qApprMaxGlyphCount, qFallbackTitle));
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
    topGridLeavesIsPseudo,
    visibleMeasureInfo,
    leafTopDimension,
    size.x,
    rightGridAvailableWidth,
    estimateWidthForMeasureValue,
    measureTextForMeasureValue,
    estimateWidthForDimensionValue,
    leavesIconWidth,
  ]);

  const averageLeafWidth = useMemo(() => {
    if (topGridLeavesIsPseudo) {
      const allMeasuresWidth = visibleMeasureInfo.reduce((totalWidth, _, index) => totalWidth + leafWidths[index], 0);
      return allMeasuresWidth / visibleMeasureInfo.length;
    }

    return leafWidths[0];
  }, [topGridLeavesIsPseudo, leafWidths, visibleMeasureInfo]);

  // when verticalScrollbarWidth is 0 (scrollbar is invisible)
  // there will be a 0/n division in below line which will result in 0
  const scrollbarWidthSharePerColumn = parseFloat((verticalScrollbarWidth / layoutService.size.x).toFixed(12));

  /**
   * Gets the width of a right grid column. This is always based on the leaf width(s)
   */
  const getRightGridColumnWidth = useCallback(
    (index?: number) =>
      topGridLeavesIsPseudo && index !== undefined
        ? leafWidths[layoutService.getMeasureInfoIndexFromCellIndex(index, true)] - scrollbarWidthSharePerColumn
        : averageLeafWidth - scrollbarWidthSharePerColumn,
    [topGridLeavesIsPseudo, leafWidths, layoutService, averageLeafWidth, scrollbarWidthSharePerColumn],
  );

  // The width of the sum of all columns, can be smaller or greater than what fits in the chart
  const rightGridFullWidth = size.x * averageLeafWidth;

  // The width that will be assigned to the top and data grid
  const rightGridWidth = Math.min(rightGridFullWidth, rightGridAvailableWidth);

  return {
    rightGridFullWidth,
    rightGridWidth,
    getRightGridColumnWidth,
  };
}
