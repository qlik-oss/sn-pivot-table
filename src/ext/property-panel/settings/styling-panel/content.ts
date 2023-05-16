import { Colors } from "../../../../pivot-table/components/shared-styles";
import type { Args, Component } from "../../../../types/QIX";

export const contentSection = {
  component: "panel-section",
  translation: "properties.Content",
  items: {
    contentFontItem: {
      component: "items",
      ref: "components",
      key: "theme",
      items: {
        fontSize: {
          component: "integer",
          ref: "content.fontSize",
          translation: "properties.fontSize",
          width: "auto",
          min: 5,
          max: 300,
          defaultValue(data: unknown, handler: unknown, args: Args) {
            const currentTheme = args.theme.current();
            return parseInt(currentTheme.object?.pivotTableV2?.content?.fontSize ?? currentTheme.fontSize, 10);
          },
          change(data: Component) {
            if (data?.content?.fontSize) {
              // eslint-disable-next-line no-param-reassign
              data.content.fontSize = Math.max(5, Math.min(300, Math.floor(data.content.fontSize)));
            }
          },
        },
        fontColor: {
          ref: "content.fontColor",
          translation: "properties.fontColor",
          type: "object",
          component: "color-picker",
          defaultValue(data: unknown, handler: unknown, args: Args) {
            const currentTheme = args.theme.current();
            return {
              color: currentTheme.object?.pivotTableV2?.content?.color ?? currentTheme.color,
            };
          },
          dualOutput: true,
        },
        background: {
          show: true,
          ref: "content.background",
          translation: "properties.background",
          type: "object",
          component: "color-picker",
          width: "auto",
          defaultValue(data: unknown, handler: unknown, args: Args) {
            const currentTheme = args.theme.current();
            return {
              color: currentTheme.object?.pivotTableV2?.content?.background ?? Colors.Transparent,
            };
          },
          dualOutput: true,
        },

        // Null value styling
        nullValueFontColor: {
          ref: "content.nullValue.fontColor",
          translation: "properties.nullValueFontColor",
          type: "object",
          component: "color-picker",
          defaultValue(data: unknown, handler: unknown, args: Args) {
            const currentTheme = args.theme.current();
            return {
              color: currentTheme.object?.pivotTableV2?.content?.nullValue?.color ?? currentTheme.color,
            };
          },
          dualOutput: true,
        },
        nullValueBackground: {
          ref: "content.nullValue.background",
          translation: "properties.nullValueBackground",
          type: "object",
          component: "color-picker",
          defaultValue(data: unknown, handler: unknown, args: Args) {
            const currentTheme = args.theme.current();
            return {
              color: currentTheme.object?.pivotTableV2?.content?.nullValue?.background ?? Colors.Transparent,
            };
          },
          dualOutput: true,
        },

        // Total value styling
        totalValueFontColor: {
          ref: "content.totalValue.fontColor",
          translation: "properties.totalValueFontColor",
          type: "object",
          component: "color-picker",
          defaultValue(data: unknown, handler: unknown, args: Args) {
            const currentTheme = args.theme.current();
            return {
              color: currentTheme.object?.pivotTableV2?.content?.totalValue?.color ?? currentTheme.color,
            };
          },
          dualOutput: true,
        },
        totalValueBackground: {
          ref: "content.totalValue.background",
          translation: "properties.totalValueBackground",
          type: "object",
          component: "color-picker",
          defaultValue(data: unknown, handler: unknown, args: Args) {
            const currentTheme = args.theme.current();
            return {
              color: currentTheme.object?.pivotTableV2?.content?.totalValue?.background ?? Colors.Transparent,
            };
          },
          dualOutput: true,
        },
      },
    },
  },
};
