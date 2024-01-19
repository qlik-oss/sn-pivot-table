import type { ColumnWidth } from "@qlik/nebula-table-utils/lib/components/ColumnAdjuster";
import { ColumnWidthType, ColumnWidthValues } from "@qlik/nebula-table-utils/lib/constants";
import type { BasicCellStyling, CellStyling } from "../../../types/types";

export const getMeasureTextArgs = (mainStyling: CellStyling, additionalStyling?: BasicCellStyling) => {
  if (additionalStyling) {
    return { ...mainStyling, fontStyle: additionalStyling.fontStyle, bold: additionalStyling.fontWeight !== "normal" };
  }

  return { ...mainStyling, bold: mainStyling.fontWeight !== "normal" };
};

export const getValidValue = (value: number | undefined, defaultValue: number) =>
  !!value && typeof value === "number" && !Number.isNaN(value) ? value : defaultValue;

export const getPixelValue = (pixels: number | undefined) => getValidValue(pixels, ColumnWidthValues.PixelsDefault);

export const getPercentageValue = (percentage: number | undefined, totalWidth: number) =>
  (getValidValue(percentage, ColumnWidthValues.PercentageDefault) * totalWidth) / 100;

export const getColumnWidthValue = (
  tableWidth: number,
  columnWidth: ColumnWidth | undefined,
  fitToContentWidth: number,
) => {
  switch (columnWidth?.type) {
    case ColumnWidthType.Pixels:
      return getPixelValue(columnWidth.pixels);
    case ColumnWidthType.Percentage:
      return getPercentageValue(columnWidth.percentage, tableWidth);
    case ColumnWidthType.FitToContent:
    case ColumnWidthType.Auto:
    default:
      return fitToContentWidth;
  }
};
