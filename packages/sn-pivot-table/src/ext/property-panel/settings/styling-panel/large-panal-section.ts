import type { stardust } from "@nebula.js/stardust";
import { Colors } from "../../../../pivot-table/components/shared-styles";
import type { Flags } from "../../../../types/types";
import createColorPickerItem from "./utils/create-color-picker-item";
import createFontFamilyItem from "./utils/create-font-family-item";
import createFontSizeItem from "./utils/create-font-size-item";
import getThemeValue from "./utils/get-theme-value";

export type LargeSection = "dimensionValues" | "measureValues" | "header";

interface Props {
  section: LargeSection;
  defaultFontStyle?: string[];
  translator: stardust.Translator;
  flags: Flags;
}

const largePanelSection = ({ section, defaultFontStyle, translator, flags }: Props) => ({
  component: "panel-section",
  translation: `properties.pivot.${section}`,
  items: {
    content: {
      component: "items",
      ref: "components",
      key: "theme",
      items: {
        fontFamily: createFontFamilyItem({
          ref: `${section}.fontFamily`,
          themeAccessor: (currentTheme) =>
            getThemeValue(currentTheme, section, "fontFamily") ?? currentTheme.fontFamily,
          translator,
          flags,
        }),
        fontWrapperItem: {
          component: "inline-wrapper",
          items: {
            fontStyle: {
              component: "font-style-buttons",
              width: false,
              ref: `${section}.fontStyle`,
              defaultValue: defaultFontStyle ?? [],
            },
            fontSize: createFontSizeItem({
              ref: `${section}.fontSize`,
              themeAccessor: (currentTheme) =>
                getThemeValue(currentTheme, section, "fontSize") ?? currentTheme.fontSize,
              translator,
            }),
            fontColor: createColorPickerItem(
              `${section}.fontColor`,
              undefined,
              (currentTheme) => getThemeValue(currentTheme, section, "color") ?? currentTheme.color,
            ),
          },
        },
        background: createColorPickerItem(
          `${section}.background`,
          "properties.background",
          (currentTheme) => getThemeValue(currentTheme, section, "backgroundColor") ?? Colors.Transparent,
        ),
      },
    },
  },
});

export default largePanelSection;
