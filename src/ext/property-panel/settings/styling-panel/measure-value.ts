import type { stardust } from "@nebula.js/stardust";
import { Colors } from "../../../../pivot-table/components/shared-styles";
import createColorPickerItem from "./utils/create-color-picker-item";
import createFontFamilyItem from "./utils/create-font-family-item";
import createFontSizeItem from "./utils/create-font-size-item";

const measureValueSection = (translator: stardust.Translator) => ({
  component: "panel-section",
  translation: "properties.pivot.measureValues",
  items: {
    content: {
      component: "items",
      ref: "components",
      key: "theme",
      items: {
        fontFamily: createFontFamilyItem({
          ref: "measureValue.fontFamily",
          themeAccessor: (currentTheme) =>
            currentTheme.object?.pivotTableV2?.measureValue?.fontFamily ?? currentTheme.fontFamily,
          translator,
        }),
        fontWrapperItem: {
          component: "inline-wrapper",
          items: {
            fontStyle: {
              component: "font-style-buttons",
              width: false,
              ref: "measureValue.fontStyle",
              defaultValue: [],
            },
            fontSize: createFontSizeItem({
              ref: "measureValue.fontSize",
              themeAccessor: (currentTheme) =>
                currentTheme.object?.pivotTableV2?.measureValue?.fontSize ?? currentTheme.fontSize,
              translator,
            }),
            fontColor: createColorPickerItem(
              "measureValue.fontColor",
              undefined,
              (currentTheme) => currentTheme.object?.pivotTableV2?.measureValue?.color ?? currentTheme.color,
            ),
          },
        },
        background: createColorPickerItem(
          "measureValue.background",
          "properties.background",
          (currentTheme) => currentTheme.object?.pivotTableV2?.measureValue?.background ?? Colors.Transparent,
        ),
        lineClamp: {
          component: "inline-wrapper",
          items: {
            rowHeight: {
              component: "dropdown",
              ref: "measureValue.lineClamp",
              translation: "ThemeStyleEditor.style.rowHeight",
              options: [...Array(10).keys()].map((x) => ({
                value: x + 1,
                translation: x + 1,
              })),
              defaultValue: 1,
            },
          },
        },
      },
    },
  },
});

export default measureValueSection;
