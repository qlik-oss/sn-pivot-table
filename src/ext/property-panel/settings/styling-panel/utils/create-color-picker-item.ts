import type { Args, CurrentTheme } from "../../../../../types/QIX";

export const createColorPickerItem = (
  ref: string,
  translation: string,
  themeAccessor: (theme: CurrentTheme) => string
) => ({
  ref,
  translation,
  // show: true,
  dualOutput: true,
  type: "object",
  component: "color-picker",
  width: "auto",
  defaultValue(data: unknown, handler: unknown, args: Args) {
    const currentTheme = args.theme.current();
    return { color: themeAccessor(currentTheme) };
  },
});
