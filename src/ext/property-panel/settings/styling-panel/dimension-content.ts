import { Colors } from "../../../../pivot-table/components/shared-styles";
import type { Args, Component } from "../../../../types/QIX";

export const getDimensionSection = (type: "rowContent" | "columnContent") => ({
  component: "panel-section",
  translation: `properties.${type}`,
  items: {
    content: {
      component: "items",
      ref: "components",
      key: "theme",
      items: {
        fontSize: {
          component: "integer",
          ref: `${type}.fontSize`,
          translation: "properties.fontSize",
          width: "auto",
          min: 5,
          max: 300,
          defaultValue(data: unknown, handler: unknown, args: Args) {
            const currentTheme = args.theme.current();
            return parseInt(currentTheme.object?.pivotTableV2?.[type]?.fontSize ?? currentTheme.fontSize, 10);
          },
          change(data: Component) {
            const fontSize = data?.[type]?.fontSize;
            if (fontSize) {
              // eslint-disable-next-line no-param-reassign
              data[type].fontSize = Math.max(5, Math.min(300, Math.floor(fontSize)));
            }
          },
        },
        fontColor: {
          ref: `${type}.fontColor`,
          translation: "properties.fontColor",
          type: "object",
          component: "color-picker",
          defaultValue(data: unknown, handler: unknown, args: Args) {
            const currentTheme = args.theme.current();
            return {
              color: currentTheme.object?.pivotTableV2?.[type]?.color ?? currentTheme.color,
            };
          },
          dualOutput: true,
        },
        background: {
          show: true,
          ref: `${type}.background`,
          translation: "properties.background",
          type: "object",
          component: "color-picker",
          width: "auto",
          defaultValue(data: unknown, handler: unknown, args: Args) {
            const currentTheme = args.theme.current();
            return {
              color: currentTheme.object?.pivotTableV2?.[type]?.background ?? Colors.Transparent,
            };
          },
          dualOutput: true,
        },

        // Null value styling
        nullValueFontColor: {
          ref: `${type}.nullValue.fontColor`,
          translation: "properties.nullValueFontColor",
          type: "object",
          component: "color-picker",
          defaultValue(data: unknown, handler: unknown, args: Args) {
            const currentTheme = args.theme.current();
            return {
              color: currentTheme.object?.pivotTableV2?.[type]?.nullValue?.color ?? currentTheme.color,
            };
          },
          dualOutput: true,
        },
        nullValueBackground: {
          ref: `${type}.nullValue.background`,
          translation: "properties.nullValueBackground",
          type: "object",
          component: "color-picker",
          defaultValue(data: unknown, handler: unknown, args: Args) {
            const currentTheme = args.theme.current();
            return {
              color: currentTheme.object?.pivotTableV2?.[type]?.nullValue?.background ?? Colors.Transparent,
            };
          },
          dualOutput: true,
        },

        // Total label styling
        totalLabelFontColor: {
          ref: `${type}.totalLabel.fontColor`,
          translation: "properties.totalLabelFontColor",
          type: "object",
          component: "color-picker",
          defaultValue(data: unknown, handler: unknown, args: Args) {
            const currentTheme = args.theme.current();
            return {
              color: currentTheme.object?.pivotTableV2?.[type]?.totalLabel?.color ?? currentTheme.color,
            };
          },
          dualOutput: true,
        },
        totalLabelBackground: {
          ref: `${type}.totalLabel.background`,
          translation: "properties.totalLabelBackground",
          type: "object",
          component: "color-picker",
          defaultValue(data: unknown, handler: unknown, args: Args) {
            const currentTheme = args.theme.current();
            return {
              color: currentTheme.object?.pivotTableV2?.[type]?.totalLabel?.background ?? Colors.Transparent,
            };
          },
          dualOutput: true,
        },
      },
    },
  },
});
