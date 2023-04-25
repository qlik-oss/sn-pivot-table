import { usePromise } from "@nebula.js/stardust";
import { StyleService } from "../types/types";

const useWaitForFonts = (styleService: StyleService) => {
  const { fontSize: headerFontSize, fontFamily: headerFontFamily } = styleService.header;
  const { fontSize, fontFamily } = styleService.content;

  const [isFontLoaded, error] = usePromise(async () => {
    await document.fonts.load(`600 ${headerFontSize} ${headerFontFamily}`);
    await document.fonts.load(`${fontSize} ${fontFamily}`);

    return true;
  }, [headerFontSize, headerFontFamily, fontSize, fontFamily]);

  // An error while loading fonts should not block the table from rendering. So if an error occur,
  // log the error and continue rendering the table
  if (error) {
    // eslint-disable-next-line no-console
    console.warn("Failed to load font:", error);
    return true;
  }

  return !!isFontLoaded;
};

export default useWaitForFonts;
