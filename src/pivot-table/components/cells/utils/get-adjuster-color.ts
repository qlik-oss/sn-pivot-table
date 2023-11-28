/* eslint-disable @typescript-eslint/no-unsafe-enum-comparison */
import { COLORING } from "@qlik/nebula-table-utils/lib/utils";
import { color } from "d3-color";
import type { StyleService } from "../../../../types/types";
import { Colors } from "../../shared-styles";

/**
 * Converts border color to opaque color,
 * by alpha blending the border color with the background the header or top grid background.
 * The background is assumed to be opaque.
 * If the background is transparent (which is the default color) it is assumed to be white
 */
export default function getAdjusterColor(styleService: StyleService, isHeader: boolean) {
  const background = isHeader ? styleService.header.background : styleService.dimensionValues.background;
  const opaqueBackground = background === Colors.Transparent ? COLORING.WHITE : background;
  const borderColor = color(styleService.grid.border)?.rgb();
  const backgroundColor = color(opaqueBackground)?.rgb();

  if (backgroundColor && borderColor && borderColor.opacity < 1) {
    const r = borderColor.opacity * borderColor.r + backgroundColor.r * (1 - borderColor.opacity);
    const g = borderColor.opacity * borderColor.g + backgroundColor.g * (1 - borderColor.opacity);
    const b = borderColor.opacity * borderColor.b + backgroundColor.b * (1 - borderColor.opacity);

    return `rgb(${r}, ${g}, ${b})`;
  }

  return styleService.grid.border;
}
