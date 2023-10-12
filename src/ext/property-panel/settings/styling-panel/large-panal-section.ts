import type { stardust } from "@nebula.js/stardust";
import { Colors } from "../../../../pivot-table/components/shared-styles";
import createColorPickerItem from "./utils/create-color-picker-item";
import createFontFamilyItem from "./utils/create-font-family-item";
import createFontSizeItem from "./utils/create-font-size-item";

interface Props {
  section: "dimensionValues" | "measureValues" | "header";
  defaultFontStyle?: string[];
  translator: stardust.Translator;
}

const largePanelSection = ({ section, defaultFontStyle, translator }: Props) => ({
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
            currentTheme.object?.pivotTableV2?.[section]?.fontFamily ?? currentTheme.fontFamily,
          translator,
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
                currentTheme.object?.pivotTableV2?.[section]?.fontSize ?? currentTheme.fontSize,
              translator,
            }),
            fontColor: createColorPickerItem(
              `${section}.fontColor`,
              undefined,
              (currentTheme) => currentTheme.object?.pivotTableV2?.[section]?.color ?? currentTheme.color,
            ),
          },
        },
        background: createColorPickerItem(
          `${section}.background`,
          "properties.background",
          (currentTheme) => currentTheme.object?.pivotTableV2?.[section]?.background ?? Colors.Transparent,
        ),
      },
    },
  },
});

export default largePanelSection;
