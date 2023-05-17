import type { stardust } from "@nebula.js/stardust";
import { Colors } from "../../../../pivot-table/components/shared-styles";
import { createColorPickerItem } from "./utils/create-color-picker-item";
import { createFontFamilyItem } from "./utils/create-font-family-item";
import { createFontSizeItem } from "./utils/create-font-size-item";
import { makeFirstLetterUpperCase } from "./utils/to-value-label";

export const getDimensionSection = (type: "rowContent" | "columnContent", translator: stardust.Translator) => ({
  component: "panel-section",
  translation: `properties.${makeFirstLetterUpperCase(type)}`,
  items: {
    content: {
      component: "items",
      ref: "components",
      key: "theme",
      items: {
        fontSize: createFontSizeItem({
          ref: `${type}.fontSize`,
          themeAccessor: (currentTheme) => currentTheme.object?.pivotTableV2?.[type]?.fontSize ?? currentTheme.fontSize,
          translator,
        }),
        fontFamily: createFontFamilyItem({
          ref: `${type}.fontFamily`,
          themeAccessor: (currentTheme) =>
            currentTheme.object?.pivotTableV2?.[type]?.fontFamily ?? currentTheme.fontFamily,
          translator,
        }),
        fontColor: createColorPickerItem(
          `${type}.fontColor`,
          "properties.fontColor",
          (currentTheme) => currentTheme.object?.pivotTableV2?.[type]?.color ?? currentTheme.color
        ),
        background: createColorPickerItem(
          `${type}.background`,
          "properties.background",
          (currentTheme) => currentTheme.object?.pivotTableV2?.[type]?.background ?? Colors.Transparent
        ),

        // Null value styling
        nullValues: {
          component: "header",
          label: translator.get("library.colors.nullvalues"),
        },
        nullValueFontColor: createColorPickerItem(
          `${type}.nullValue.fontColor`,
          "properties.fontColor",
          (currentTheme) => currentTheme.object?.pivotTableV2?.[type]?.nullValue?.color ?? currentTheme.color
        ),
        nullValueBackground: createColorPickerItem(
          `${type}.nullValue.background`,
          "properties.background",
          (currentTheme) => currentTheme.object?.pivotTableV2?.[type]?.nullValue?.background ?? Colors.Transparent
        ),

        // Total label styling
        totalsHeader: {
          component: "header",
          label: translator.get("properties.totals"),
        },
        totalLabelFontColor: createColorPickerItem(
          `${type}.totalLabel.fontColor`,
          "properties.fontColor",
          (currentTheme) => currentTheme.object?.pivotTableV2?.[type]?.totalLabel?.color ?? currentTheme.color
        ),
        totalLabelBackground: createColorPickerItem(
          `${type}.totalLabel.background`,
          "properties.background",
          (currentTheme) => currentTheme.object?.pivotTableV2?.[type]?.totalLabel?.background ?? Colors.Transparent
        ),
      },
    },
  },
});
