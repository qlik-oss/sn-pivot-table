import { useMemo } from "@nebula.js/stardust";
import type { CellStyling, StyleService } from "../types/types";

// Convert cell styling to https://developer.mozilla.org/en-US/docs/Web/CSS/font string
const toCssFont = ({ fontStyle, fontWeight, fontSize, fontFamily }: CellStyling) =>
  fontWeight ? `${fontStyle} ${fontWeight} ${fontSize} ${fontFamily}` : `${fontStyle} ${fontSize} ${fontFamily}`;

const useFonts = (styleService: StyleService) =>
  useMemo(
    () => [
      // Use Set to remove duplicates
      ...new Set([
        toCssFont(styleService.header),
        toCssFont(styleService.dimensionValues),
        toCssFont({ ...styleService.dimensionValues, ...styleService.measureLabels }),
        toCssFont({ ...styleService.dimensionValues, ...styleService.nullValues }),
        toCssFont({ ...styleService.dimensionValues, ...styleService.totalValues }),
        toCssFont(styleService.measureValues),
        toCssFont({ ...styleService.measureValues, ...styleService.nullValues }),
        toCssFont({ ...styleService.measureValues, ...styleService.totalValues }),
      ]),
    ],
    [styleService],
  );

export default useFonts;
