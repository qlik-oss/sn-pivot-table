/* eslint-disable @typescript-eslint/no-unsafe-enum-comparison */
import { COLORING } from "@qlik/nebula-table-utils/lib/utils";
import { color } from "d3-color";
import type { AdjusterCellInfo, StyleService } from "../../../../types/types";
import { Colors } from "../../shared-styles";

/**
 * Converts border color to opaque color,
 * by alpha blending the border color with the header or top grid background.
 * If the background is 'transparent' (which it is by default), it is assumed to be white.
 * Otherwise the background is assumed to be opaque.
 */
export default function getAdjusterColor(styleService: StyleService, cellInfo: AdjusterCellInfo) {
  const topGridBackground = cellInfo.expressionColor?.background || styleService.dimensionValues.background;
  const background = cellInfo.isLeftColumn ? styleService.header.background : topGridBackground;
  const nonTransparentBackground = background === Colors.Transparent ? COLORING.WHITE : background;
  const borderColor = color(styleService.grid.border)?.rgb();
  const backgroundColor = color(nonTransparentBackground)?.rgb();

  if (backgroundColor && borderColor && borderColor.opacity < 1) {
    const backgroundWeight = 1 - borderColor.opacity;
    const r = borderColor.opacity * borderColor.r + backgroundWeight * backgroundColor.r;
    const g = borderColor.opacity * borderColor.g + backgroundWeight * backgroundColor.g;
    const b = borderColor.opacity * borderColor.b + backgroundWeight * backgroundColor.g;

    return `rgb(${r}, ${g}, ${b})`;
  }

  return styleService.grid.border;
}
