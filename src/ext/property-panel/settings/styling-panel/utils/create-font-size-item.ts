import type { Args, Component, CurrentTheme } from "../../../../../types/QIX";

type SupportedSections = "header" | "content" | "rowContent" | "columnContent";

export const createFontSizeItem = (
  ref: string,
  translation: string,
  themeAccessor: (theme: CurrentTheme) => string
) => ({
  component: "integer",
  ref,
  translation,
  width: "auto",
  min: 5,
  max: 300,
  defaultValue(data: unknown, handler: unknown, args: Args) {
    const currentTheme = args.theme.current();
    const fontSize = themeAccessor(currentTheme);
    return parseInt(fontSize, 10);
  },
  change(data: Component) {
    const dataPath = ref.split(".")[0] as SupportedSections;
    const fontSize = data?.[dataPath]?.fontSize;
    if (fontSize) {
      // eslint-disable-next-line no-param-reassign
      data[dataPath].fontSize = Math.max(5, Math.min(300, Math.floor(fontSize)));
    }
  },
});
