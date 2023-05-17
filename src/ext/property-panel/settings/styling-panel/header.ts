import type { stardust } from "@nebula.js/stardust";
import { Colors } from "../../../../pivot-table/components/shared-styles";
import { createColorPickerItem } from "./utils/create-color-picker-item";
import { createFontFamilyItem } from "./utils/create-font-family-item";
import { createFontSizeItem } from "./utils/create-font-size-item";

export const headerSection = (translator: stardust.Translator) => ({
  translation: "properties.Header",
  component: "panel-section",
  items: {
    headerFontItem: {
      component: "items",
      ref: "components",
      key: "theme",
      items: {
        fontSize: createFontSizeItem({
          ref: "header.fontSize",
          themeAccessor: (currentTheme) => currentTheme.object?.pivotTableV2?.header?.fontSize ?? currentTheme.fontSize,
          translator,
        }),
        fontFamily: createFontFamilyItem({
          ref: "header.fontFamily",
          translator,
          themeAccessor: (currentTheme) =>
            currentTheme.object?.pivotTableV2?.header?.fontFamily ?? currentTheme.fontFamily,
        }),
        background: createColorPickerItem(
          "header.background",
          "properties.background",
          (currentTheme) => currentTheme.object?.pivotTableV2?.header?.background ?? Colors.Transparent
        ),

        // Row title styling
        rowTitleHeader: {
          component: "header",
          label: translator.get("Common.Rows"),
        },
        rowTitleFontColor: createColorPickerItem(
          "header.rowTitle.fontColor",
          "properties.fontColor",
          (currentTheme) => currentTheme.object?.pivotTableV2?.header?.rowTitle?.color ?? currentTheme.color
        ),
        rowTitleBackground: createColorPickerItem(
          "header.rowTitle.background",
          "properties.background",
          (currentTheme) => currentTheme.object?.pivotTableV2?.header?.rowTitle?.background ?? Colors.Transparent
        ),

        // Column title styling
        columntTitleHeader: {
          component: "header",
          label: translator.get("Common.Columns"),
        },
        columnTitleFontColor: createColorPickerItem(
          "header.columnTitle.fontColor",
          "properties.fontColor",
          (currentTheme) => currentTheme.object?.pivotTableV2?.header?.columnTitle?.color ?? currentTheme.color
        ),
        columnTitleBackground: createColorPickerItem(
          "header.columnTitle.background",
          "properties.background",
          (currentTheme) => currentTheme.object?.pivotTableV2?.header?.columnTitle?.background ?? Colors.Transparent
        ),
      },
    },
  },
});
