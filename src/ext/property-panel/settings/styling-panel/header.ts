import { Colors } from "../../../../pivot-table/components/shared-styles";
import type { Args, Component } from "../../../../types/QIX";
import { createColorPickerItem } from "./utils/create-color-picker-item";

export const headerSection = {
  translation: "properties.Header",
  component: "panel-section",
  items: {
    headerFontItem: {
      component: "items",
      ref: "components",
      key: "theme",
      items: {
        headerFontSize: {
          component: "integer",
          ref: "header.fontSize",
          translation: "properties.fontSize",
          width: "auto",
          min: 5,
          max: 300,
          defaultValue(data: unknown, handler: unknown, args: Args) {
            const currentTheme = args.theme.current();
            const fontSize = currentTheme.object?.pivotTableV2?.header?.fontSize ?? currentTheme.fontSize;
            return parseInt(fontSize, 10);
          },
          change(data: Component) {
            if (data?.header?.fontSize) {
              // eslint-disable-next-line no-param-reassign
              data.header.fontSize = Math.max(5, Math.min(300, Math.floor(data.header.fontSize)));
            }
          },
        },
        background: createColorPickerItem(
          "header.background",
          "properties.background",
          (currentTheme) => currentTheme.object?.pivotTableV2?.header?.background ?? Colors.Transparent
        ),
        // background: {
        //   show: true,
        //   ref: "header.background",
        //   translation: "properties.background",
        //   type: "object",
        //   component: "color-picker",
        //   width: "auto",
        //   defaultValue(data: unknown, handler: unknown, args: Args) {
        //     const currentTheme = args.theme.current();
        //     return {
        //       color: currentTheme.object?.pivotTableV2?.header?.background ?? Colors.Transparent,
        //     };
        //   },
        //   dualOutput: true,
        // },

        // Row title styling
        rowTitleFontColor: {
          show: true,
          ref: "header.rowTitle.fontColor",
          translation: "properties.fontColorRowTitle",
          type: "object",
          component: "color-picker",
          width: "auto",
          defaultValue(data: unknown, handler: unknown, args: Args) {
            const currentTheme = args.theme.current();
            return {
              color: currentTheme.object?.pivotTableV2?.header?.rowTitle?.color ?? currentTheme.color,
            };
          },
          dualOutput: true,
        },
        rowTitleBackground: {
          show: true,
          ref: "header.rowTitle.background",
          translation: "properties.backgroundRowTitle",
          type: "object",
          component: "color-picker",
          width: "auto",
          defaultValue(data: unknown, handler: unknown, args: Args) {
            const currentTheme = args.theme.current();
            return {
              color: currentTheme.object?.pivotTableV2?.header?.rowTitle?.background ?? Colors.Transparent,
            };
          },
          dualOutput: true,
        },

        // Column title styling
        columnTitleFontColor: {
          show: true,
          ref: "header.columnTitle.fontColor",
          translation: "properties.fontColorColumnTitle",
          type: "object",
          component: "color-picker",
          width: "auto",
          defaultValue(data: unknown, handler: unknown, args: Args) {
            const currentTheme = args.theme.current();
            return {
              color: currentTheme.object?.pivotTableV2?.header?.columnTitle?.color ?? currentTheme.color,
            };
          },
          dualOutput: true,
        },
        columnTitleBackground: {
          show: true,
          ref: "header.columnTitle.background",
          translation: "properties.backgroundColumnTitle",
          type: "object",
          component: "color-picker",
          width: "auto",
          defaultValue(data: unknown, handler: unknown, args: Args) {
            const currentTheme = args.theme.current();
            return {
              color: currentTheme.object?.pivotTableV2?.header?.columnTitle?.background ?? Colors.Transparent,
            };
          },
          dualOutput: true,
        },
      },
    },
  },
};
