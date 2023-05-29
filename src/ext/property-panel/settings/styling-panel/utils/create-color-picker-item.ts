import type { Args, CurrentTheme } from "../../../../../types/QIX";

const createColorPickerItem = (ref: string, translation: string, themeAccessor: (theme: CurrentTheme) => string) => ({
  ref,
  translation,
  dualOutput: true,
  type: "object",
  component: "color-picker",
  width: "auto",
  defaultValue(data: unknown, handler: unknown, args: Args) {
    const currentTheme = args.theme.current();
    return { color: themeAccessor(currentTheme) };
  },
});

export default createColorPickerItem;
