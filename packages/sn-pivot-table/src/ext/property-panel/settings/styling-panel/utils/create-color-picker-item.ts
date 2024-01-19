import { Colors } from "../../../../../pivot-table/components/shared-styles";
import type { Args, CurrentTheme } from "../../../../../types/QIX";

const createColorPickerItem = (
  ref: string,
  translation: string | undefined,
  themeAccessor: (theme: CurrentTheme) => string,
) => ({
  ref,
  translation,
  dualOutput: true,
  type: "object",
  component: "color-picker",
  width: "auto",
  disableNone: false,
  defaultValue(data: unknown, handler: unknown, args: Args) {
    const currentTheme = args.theme.current();
    const color = themeAccessor(currentTheme);

    return { color: color === Colors.Transparent.toString() ? "none" : color };
  },
});

export default createColorPickerItem;
