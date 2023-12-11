import type { ColumnWidth } from "@qlik/nebula-table-utils/lib/components/ColumnAdjuster";
import { useMeasureText, useOnPropsChange } from "@qlik/nebula-table-utils/lib/hooks";
import { useCallback, useState } from "react";
import { PSEUDO_DIMENSION_KEY } from "../../../constants";
import { ColumnWidthLocation, type HeaderCell } from "../../../types/types";
import { useStyleContext } from "../../contexts/StyleProvider";
import {
  EXPAND_ICON_SIZE,
  LEFT_GRID_MAX_WIDTH_RATIO,
  LOCK_ICON_SIZE,
  MENU_ICON_SIZE,
  TOTAL_CELL_PADDING,
} from "./constants";
import type { ColumnWidthLeftHook, LeftGridWidthInfo } from "./types";
import { getColumnWidthValue, getMeasureTextArgs } from "./utils";

export default function useColumnWidthLeft({ layoutService, tableRect, headersData }: ColumnWidthLeftHook) {
  const {
    layout: {
      qHyperCube: { qMeasureInfo, qNoOfLeftDims, topHeadersColumnWidth },
    },
    isFullyExpanded,
  } = layoutService;
  const styleService = useStyleContext();
  const { measureText: measureTextForHeader } = useMeasureText(getMeasureTextArgs(styleService.header));
  const { estimateWidth: estimateWidthForDimensionValue } = useMeasureText(
    getMeasureTextArgs(styleService.dimensionValues),
  );
  const { measureText: measureTextForMeasureLabel } = useMeasureText(
    getMeasureTextArgs(styleService.dimensionValues, styleService.measureLabels),
  );

  const calculateLeftGridWidthInfo = useCallback(
    (widthOverride?: number, overrideIndex?: number) => {
      const dimensionHeaderCellWidth = (lastRowHeader: HeaderCell) => {
        const { label, isLocked } = lastRowHeader;
        const lockedIconSize = isLocked ? LOCK_ICON_SIZE : 0;
        return TOTAL_CELL_PADDING + measureTextForHeader(label) + MENU_ICON_SIZE + lockedIconSize;
      };

      const maxMeasureColumnWidth = (dimensionsFitToContentWidth = 0) =>
        qMeasureInfo.reduce((maxWidth, { qFallbackTitle, columnWidth }) => {
          // Note that the
          const measureLabelWidth = measureTextForMeasureLabel(qFallbackTitle) + TOTAL_CELL_PADDING;
          return Math.max(
            maxWidth,
            getColumnWidthValue(tableRect.width, columnWidth, Math.max(measureLabelWidth, dimensionsFitToContentWidth)),
          );
        }, 0);

      const dimensionsFitToContentWidth = (collIdx: number) =>
        headersData.data.reduce((maxWidth, row) => {
          const lastColumnHeader = row[collIdx];
          if (!lastColumnHeader) return maxWidth;
          if (lastColumnHeader.id === PSEUDO_DIMENSION_KEY) return maxWidth;

          const fit = dimensionHeaderCellWidth(lastColumnHeader);

          return Math.max(fit, maxWidth);
        }, 0);

      const dimensionValuesFitToContentWidth = (headerCell: HeaderCell, collIdx: number) => {
        const { qApprMaxGlyphCount, isLeftDimension } = headerCell;
        const expandIconSize =
          !isFullyExpanded && isLeftDimension && collIdx < qNoOfLeftDims - 1 ? EXPAND_ICON_SIZE : 0;
        return TOTAL_CELL_PADDING + estimateWidthForDimensionValue(qApprMaxGlyphCount as number) + expandIconSize;
      };

      let sumOfWidths = 0;

      const lastRow = headersData.data.at(-1) as HeaderCell[];
      const columnWidths = lastRow.map((lastRowHeader, collIdx) => {
        let width = TOTAL_CELL_PADDING;

        if (widthOverride && overrideIndex !== undefined && overrideIndex === lastRowHeader.colIdx) {
          width = widthOverride;
        } else {
          let columnWidth: ColumnWidth | undefined;
          if (lastRowHeader.columnWidthLocation === ColumnWidthLocation.Pivot) {
            columnWidth = topHeadersColumnWidth;
          } else if (lastRowHeader.columnWidthLocation === ColumnWidthLocation.Dimension) {
            ({ columnWidth } = lastRowHeader);
          }

          let fitToContentWidth = 0;
          if (lastRowHeader.isLeftDimension) {
            if (lastRowHeader.id === PSEUDO_DIMENSION_KEY) {
              fitToContentWidth = maxMeasureColumnWidth();
            } else {
              fitToContentWidth = Math.max(
                dimensionsFitToContentWidth(collIdx),
                dimensionValuesFitToContentWidth(lastRowHeader, collIdx),
              );
            }
          } else if (!lastRowHeader.isLeftDimension) {
            fitToContentWidth = dimensionsFitToContentWidth(collIdx);
            if (lastRowHeader.columnWidthLocation === ColumnWidthLocation.Measures) {
              fitToContentWidth = maxMeasureColumnWidth(fitToContentWidth);
            }
          }

          width = getColumnWidthValue(tableRect.width, columnWidth, fitToContentWidth);
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
      headersData.data,
      isFullyExpanded,
      measureTextForHeader,
      measureTextForMeasureLabel,
      qMeasureInfo,
      qNoOfLeftDims,
      tableRect.width,
      topHeadersColumnWidth,
    ],
  );

  // Note that it is not `calculateLeftGridWidthInfo` itself that is stored on the state,
  // it is the return value of that function, react will run it on first render
  const [leftGridWidthInfo, setLeftGridWidthInfo] = useState<LeftGridWidthInfo>(calculateLeftGridWidthInfo);

  useOnPropsChange(() => {
    setLeftGridWidthInfo(calculateLeftGridWidthInfo());
  }, [calculateLeftGridWidthInfo]);

  const overrideLeftGridWidth = useCallback(
    (width: number, index: number) => {
      setLeftGridWidthInfo(calculateLeftGridWidthInfo(width, index));
    },
    [calculateLeftGridWidthInfo],
  );

  return {
    ...leftGridWidthInfo,
    overrideLeftGridWidth,
  };
}
