import type { stardust } from "@nebula.js/stardust";
import { Colors } from "../../../../pivot-table/components/shared-styles";
import createColorPickerItem from "./utils/create-color-picker-item";
import createFontFamilyItem from "./utils/create-font-family-item";
import createFontSizeItem from "./utils/create-font-size-item";

const headerSection = (translator: stardust.Translator) => ({
  translation: "properties.pivot.header",
  component: "panel-section",
  items: {
    headerFontItem: {
      component: "items",
      ref: "components",
      key: "theme",
      items: {
        fontFamily: createFontFamilyItem({
          ref: "header.fontFamily",
          translator,
          themeAccessor: (currentTheme) =>
            currentTheme.object?.pivotTableV2?.header?.fontFamily ?? currentTheme.fontFamily,
        }),
        fontWrapperItem: {
          component: "inline-wrapper",
          items: {
            fontStyle: {
              component: "font-style-buttons",
              width: false,
              ref: "header.fontStyle",
              defaultValue: ["bold"],
            },
            fontSize: createFontSizeItem({
              ref: "header.fontSize",
              themeAccessor: (currentTheme) =>
                currentTheme.object?.pivotTableV2?.header?.fontSize ?? currentTheme.fontSize,
              translator,
            }),
            fontColor: createColorPickerItem(
              "header.fontColor",
              undefined,
              (currentTheme) => currentTheme.object?.pivotTableV2?.header?.color ?? currentTheme.color,
            ),
          },
        },
        background: createColorPickerItem(
          "header.background",
          "properties.background",
          (currentTheme) => currentTheme.object?.pivotTableV2?.header?.background ?? Colors.Transparent,
        ),
      },
    },
  },
});

export default headerSection;
