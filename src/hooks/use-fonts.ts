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
        toCssFont(styleService.dimensionValue),
        toCssFont({ ...styleService.dimensionValue, ...styleService.measureLabel }),
        toCssFont({ ...styleService.dimensionValue, ...styleService.nullValue }),
        toCssFont({ ...styleService.dimensionValue, ...styleService.totalValue }),
        toCssFont(styleService.measureValue),
        toCssFont({ ...styleService.measureValue, ...styleService.nullValue }),
        toCssFont({ ...styleService.measureValue, ...styleService.totalValue }),
      ]),
    ],
    [styleService],
  );

export default useFonts;
