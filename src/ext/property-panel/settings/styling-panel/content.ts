import type { stardust } from "@nebula.js/stardust";
import { Colors } from "../../../../pivot-table/components/shared-styles";
import createColorPickerItem from "./utils/create-color-picker-item";
import createFontFamilyItem from "./utils/create-font-family-item";
import createFontSizeItem from "./utils/create-font-size-item";

const contentSection = (translator: stardust.Translator) => ({
  component: "panel-section",
  translation: "properties.Content",
  items: {
    content: {
      component: "items",
      ref: "components",
      key: "theme",
      items: {
        fontFamily: createFontFamilyItem({
          ref: "content.fontFamily",
          themeAccessor: (currentTheme) =>
            currentTheme.object?.pivotTableV2?.content?.fontFamily ?? currentTheme.fontFamily,
          translator,
        }),
        fontWrapperItem: {
          component: "inline-wrapper",
          items: {
            fontStyle: {
              component: "font-style-buttons",
              width: false,
              ref: "content.fontStyle",
              defaultValue: [],
            },
            fontSize: createFontSizeItem({
              ref: "content.fontSize",
              themeAccessor: (currentTheme) =>
                currentTheme.object?.pivotTableV2?.content?.fontSize ?? currentTheme.fontSize,
              translator,
            }),
            fontColor: createColorPickerItem(
              "content.fontColor",
              undefined,
              (currentTheme) => currentTheme.object?.pivotTableV2?.content?.color ?? currentTheme.color,
            ),
          },
        },
        background: createColorPickerItem(
          "content.background",
          "properties.background",
          (currentTheme) => currentTheme.object?.pivotTableV2?.content?.background ?? Colors.Transparent,
        ),
        lineClamp: {
          component: "inline-wrapper",
          items: {
            rowHeight: {
              component: "dropdown",
              ref: "content.lineClamp",
              translation: "ThemeStyleEditor.style.rowHeight",
              options: [...Array(10).keys()].map((x) => ({
                value: x + 1,
                translation: x + 1,
              })),
              defaultValue: 1,
            },
          },
        },

        // Total value styling
        totalsHeader: {
          component: "header",
          label: translator.get("properties.totals"),
        },
        totalValueFontColor: createColorPickerItem(
          "content.totalValue.fontColor",
          "properties.fontColor",
          (currentTheme) => currentTheme.object?.pivotTableV2?.content?.totalValue?.color ?? currentTheme.color,
        ),
        totalValueBackground: createColorPickerItem(
          "content.totalValue.background",
          "properties.background",
          (currentTheme) => currentTheme.object?.pivotTableV2?.content?.totalValue?.background ?? Colors.Transparent,
        ),
      },
    },
  },
});

export default contentSection;
