import type { stardust } from "@nebula.js/stardust";
import { Colors } from "../../../../pivot-table/components/shared-styles";
import createColorPickerItem from "./utils/create-color-picker-item";
import createFontFamilyItem from "./utils/create-font-family-item";
import createFontSizeItem from "./utils/create-font-size-item";

const getDimensionSection = (translator: stardust.Translator) => ({
  component: "panel-section",
  translation: "properties.pivot.dimensionValues",
  items: {
    content: {
      component: "items",
      ref: "components",
      key: "theme",
      items: {
        fontFamily: createFontFamilyItem({
          ref: "dimensionValue.fontFamily",
          themeAccessor: (currentTheme) =>
            currentTheme.object?.pivotTableV2?.dimensionValue?.fontFamily ?? currentTheme.fontFamily,
          translator,
        }),
        fontWrapperItem: {
          component: "inline-wrapper",
          items: {
            fontStyle: {
              component: "font-style-buttons",
              width: false,
              ref: "dimensionValue.fontStyle",
              defaultValue: [],
            },
            fontSize: createFontSizeItem({
              ref: "dimensionValue.fontSize",
              themeAccessor: (currentTheme) =>
                currentTheme.object?.pivotTableV2?.dimensionValue?.fontSize ?? currentTheme.fontSize,
              translator,
            }),
            fontColor: createColorPickerItem(
              "dimensionValue.fontColor",
              undefined,
              (currentTheme) => currentTheme.object?.pivotTableV2?.dimensionValue?.color ?? currentTheme.color,
            ),
          },
        },
        background: createColorPickerItem(
          "dimensionValue.background",
          "properties.background",
          (currentTheme) => currentTheme.object?.pivotTableV2?.dimensionValue?.background ?? Colors.Transparent,
        ),
      },
    },
  },
});

export default getDimensionSection;
