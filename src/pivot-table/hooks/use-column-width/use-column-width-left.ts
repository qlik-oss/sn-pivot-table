import type { ColumnWidth } from "@qlik/nebula-table-utils/lib/components/ColumnAdjuster";
import { ColumnWidthType } from "@qlik/nebula-table-utils/lib/constants";
import { useMeasureText, useOnPropsChange } from "@qlik/nebula-table-utils/lib/hooks";
import { useCallback, useState } from "react";
import { PSEUDO_DIMENSION_KEY } from "../../../constants";
import type { HeaderCell } from "../../../types/types";
import { useStyleContext } from "../../contexts/StyleProvider";
import {
  EXPAND_ICON_SIZE,
  LEFT_GRID_MAX_WIDTH_RATIO,
  LOCK_ICON_SIZE,
  MENU_ICON_SIZE,
  TOTAL_CELL_PADDING,
} from "./constants";
import type { ColumnWidthLeftHook, GetHeaderCellsIconsVisibilityStatus, LeftGridWidthInfo } from "./types";
import { getMeasureTextArgs, getPercentageValue, getPixelValue } from "./utils";

export default function useColumnWidthLeft({ layoutService, tableRect, headersData }: ColumnWidthLeftHook) {
  const {
    layout: {
      qHyperCube: { qMeasureInfo, qNoOfLeftDims },
    },
    isFullyExpanded,
  } = layoutService;
  const styleService = useStyleContext();
  const { measureText: measureTextForHeader } = useMeasureText(getMeasureTextArgs(styleService.header));
  const { measureText: measureTextForMeasureValue } = useMeasureText(getMeasureTextArgs(styleService.measureValues));
  const { estimateWidth: estimateWidthForDimensionValue, measureText: measureTextForDimensionValue } = useMeasureText(
    getMeasureTextArgs(styleService.dimensionValues),
  );

  const calculateLeftGridWidthInfo = useCallback(
    (widthOverride?: number, overrideIndex?: number) => {
      const getColumnWidth = (columnWidth: ColumnWidth | undefined, fitToContentWidth: number) => {
        switch (columnWidth?.type) {
          case ColumnWidthType.Pixels:
            return getPixelValue(columnWidth.pixels);
          case ColumnWidthType.Percentage:
            return getPercentageValue(columnWidth.percentage) * tableRect.width;
          case ColumnWidthType.FitToContent:
          case ColumnWidthType.Auto:
          default:
            return fitToContentWidth;
        }
      };

      const maxMeasureCellWidth = qMeasureInfo.reduce((maxWidth, { qFallbackTitle, columnWidth }) => {
        const fitToContentWidth = measureTextForMeasureValue(qFallbackTitle) + TOTAL_CELL_PADDING;
        return Math.max(maxWidth, getColumnWidth(columnWidth, fitToContentWidth));
      }, 0);

      let sumOfWidths = 0;

      const lastRow = headersData.data.at(-1) as HeaderCell[];
      const columnWidths = lastRow.map((lastRowHeader, collIdx) => {
        let width = TOTAL_CELL_PADDING;

        if (widthOverride && overrideIndex !== undefined && overrideIndex === lastRowHeader.colIdx) {
          width = widthOverride;
        } else {
          width = headersData.data.reduce((maxWidth, row, rowIdx) => {
            const header = row[collIdx];
            if (!header) return maxWidth;

            const lastRowLastColumn = rowIdx === headersData.size.y - 1 && collIdx === headersData.size.x - 1;
            let cellWidth = 0;

            if (header.id === PSEUDO_DIMENSION_KEY && header.isLeftDimension) {
              // Use the max width of all measures
              cellWidth = maxMeasureCellWidth;
            } else {
              const { label, qApprMaxGlyphCount, columnWidth, isLocked } = header;
              const expandIconSize =
                !isFullyExpanded && header.isLeftDimension && !header.isLastDimension ? EXPAND_ICON_SIZE : 0;
              const lockedIconSize = isLocked ? LOCK_ICON_SIZE : 0;

              let fitToContentWidth = 0;
              if (header.isLeftDimension) {
                fitToContentWidth =
                  TOTAL_CELL_PADDING +
                  Math.max(
                    measureTextForHeader(label) + MENU_ICON_SIZE + lockedIconSize,
                    estimateWidthForDimensionValue(qApprMaxGlyphCount as number) + expandIconSize,
                  );
              } else if (lastRowLastColumn && !header.isLeftDimension && layoutService.hasPseudoDimOnLeft) {
                fitToContentWidth = maxMeasureCellWidth;
              } else {
                fitToContentWidth = TOTAL_CELL_PADDING + measureTextForHeader(label) + MENU_ICON_SIZE + lockedIconSize;
              }

              cellWidth = getColumnWidth(columnWidth, fitToContentWidth);
            }

            // The last cell setting should override the other cells in that column, so we don't pick the max
            const isTypeAuto = !header.columnWidth || header.columnWidth.type === ColumnWidthType.Auto;
            if (lastRowLastColumn && !isTypeAuto) {
              return cellWidth;
            }

            return Math.max(maxWidth, cellWidth);
          }, width);
        }

        sumOfWidths += width;
        return width;
      });

      return {
        leftGridWidth: Math.min(tableRect.width * LEFT_GRID_MAX_WIDTH_RATIO, sumOfWidths),
        leftGridColumnWidths: columnWidths,
        leftGridFullWidth: sumOfWidths,
      };
    },
    [
      estimateWidthForDimensionValue,
      headersData,
      isFullyExpanded,
      layoutService,
      measureTextForHeader,
      measureTextForMeasureValue,
      qMeasureInfo,
      tableRect.width,
    ],
  );

  // Note that it is not `calculateLeftGridWidthInfo` itself that is stored on the state,
  // it is the return value of that function, react will run it on first render
  const [leftGridWidthInfo, setLeftGridWidthInfo] = useState<LeftGridWidthInfo>(calculateLeftGridWidthInfo);

  useOnPropsChange(() => {
    setLeftGridWidthInfo(calculateLeftGridWidthInfo());
  }, [
    headersData,
    tableRect.width,
    qMeasureInfo,
    measureTextForDimensionValue,
    isFullyExpanded,
    qNoOfLeftDims,
    measureTextForHeader,
    estimateWidthForDimensionValue,
    calculateLeftGridWidthInfo,
  ]);

  const overrideLeftGridWidth = useCallback(
    (width: number, index: number) => {
      setLeftGridWidthInfo(calculateLeftGridWidthInfo(width, index));
    },
    [calculateLeftGridWidthInfo],
  );

  const getHeaderCellsIconsVisibilityStatus = useCallback<GetHeaderCellsIconsVisibilityStatus>(
    (idx, isLocked, title = "") => {
      const colWidth = leftGridWidthInfo.leftGridColumnWidths[idx];
      let shouldShowMenuIcon = false;
      let shouldShowLockIcon = false;
      const measuredTextForHeader = measureTextForHeader(title);

      let headerSize = measuredTextForHeader + TOTAL_CELL_PADDING;

      if (isLocked && headerSize + LOCK_ICON_SIZE <= colWidth) {
        shouldShowLockIcon = true;
        headerSize += LOCK_ICON_SIZE;
      }
      if (headerSize + MENU_ICON_SIZE <= colWidth) {
        shouldShowMenuIcon = true;
      }

      return {
        shouldShowMenuIcon,
        shouldShowLockIcon,
      };
    },
    [leftGridWidthInfo, measureTextForHeader],
  );

  return {
    ...leftGridWidthInfo,
    getHeaderCellsIconsVisibilityStatus,
    overrideLeftGridWidth,
  };
}
