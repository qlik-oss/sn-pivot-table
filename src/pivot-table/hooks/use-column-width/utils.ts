import { ColumnWidthValues } from "@qlik/nebula-table-utils/lib/constants";
import type { CellStyling } from "../../../types/types";

export const getValidValue = (value: number | undefined, defaultValue: number) =>
  !!value && typeof value === "number" && !Number.isNaN(value) ? value : defaultValue;

export const getPixelValue = (pixels: number | undefined) => getValidValue(pixels, ColumnWidthValues.PixelsDefault);

export const getPercentageValue = (percentage: number | undefined) =>
  getValidValue(percentage, ColumnWidthValues.PercentageDefault) / 100;

export const getMeasureTextArgs = (styling: CellStyling) => ({ ...styling, bold: styling.fontWeight !== "normal" });
