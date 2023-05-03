// import { TOTAL_MODE_ON } from '../../constants';

import type { Args, Component } from "../../types/QIX";

interface ExtendedVisualizationHyperCubeDef extends EngineAPI.IVisualizationHyperCubeDef {
  qExpansionState: unknown[];
}

export interface ExtendedGenericHyperCubeProperties extends EngineAPI.IGenericHyperCubeProperties {
  qHyperCubeDef: ExtendedVisualizationHyperCubeDef;
}

export interface Emitter {
  $emit: (method: string, props: ExtendedGenericHyperCubeProperties) => void;
}

const getStylingPanelConfig = () => ({
  type: "items",
  items: [
    {
      component: "styling-panel",
      chartTitle: "Object.PivotTable",
      subtitle: "LayerStyleEditor.component.styling",
      translation: "LayerStyleEditor.component.styling",
      ref: "components",
      useGeneral: true,
      defaultValue: [],
      items: {
        headerSection: {
          translation: "properties.Header",
          component: "panel-section",
          items: {
            headerFontItem: {
              component: "items",
              ref: "components",
              key: "theme",
              items: {
                headerFontWrapper: {
                  component: "inline-wrapper",
                  items: {
                    headerFontSize: {
                      component: "integer",
                      ref: "header.fontSize",
                      translation: "properties.fontSize",
                      width: 9,
                      min: 5,
                      max: 300,
                      defaultValue(data: unknown, handler: unknown, args: Args) {
                        const currentTheme = args.theme.current();
                        const fontSize = currentTheme.object?.pivotTable?.header?.fontSize ?? currentTheme.fontSize;
                        return parseInt(fontSize, 10);
                      },
                      change(data: Component) {
                        if (data?.header?.fontSize) {
                          // eslint-disable-next-line no-param-reassign
                          data.header.fontSize = Math.max(5, Math.min(300, Math.floor(data.header.fontSize)));
                        }
                      },
                    },
                    headerFontColor: {
                      show: true,
                      ref: "header.fontColor",
                      type: "object",
                      component: "color-picker",
                      defaultValue(data: unknown, handler: unknown, args: Args) {
                        const currentTheme = args.theme.current();
                        return {
                          color: currentTheme.object?.pivotTable?.header?.color ?? currentTheme.color,
                        };
                      },
                      dualOutput: true,
                    },
                  },
                },
              },
            },
          },
        },
        contentSection: {
          component: "panel-section",
          translation: "properties.Content",
          items: {
            contentFontItem: {
              component: "items",
              ref: "components",
              key: "theme",
              items: {
                contentFontWrapper: {
                  component: "inline-wrapper",
                  items: {
                    contentFontSize: {
                      component: "integer",
                      ref: "content.fontSize",
                      translation: "properties.fontSize",
                      width: 9,
                      min: 5,
                      max: 300,
                      defaultValue(data: unknown, handler: unknown, args: Args) {
                        const currentTheme = args.theme.current();
                        return parseInt(
                          currentTheme.object?.pivotTable?.content?.fontSize ?? currentTheme.fontSize,
                          10
                        );
                      },
                      change(data: Component) {
                        if (data?.content?.fontSize) {
                          // eslint-disable-next-line no-param-reassign
                          data.content.fontSize = Math.max(5, Math.min(300, Math.floor(data.content.fontSize)));
                        }
                      },
                    },
                    contentFontColor: {
                      ref: "content.fontColor",
                      type: "object",
                      component: "color-picker",
                      defaultValue(data: unknown, handler: unknown, args: Args) {
                        const currentTheme = args.theme.current();
                        return {
                          color: currentTheme.object?.pivotTable?.content?.color ?? currentTheme.color,
                        };
                      },
                      dualOutput: true,
                    },
                  },
                },
              },
            },
          },
        },
        rowHeightSection: {
          translation: "ThemeStyleEditor.style.rowHeight",
          component: "panel-section",
          items: {
            rowHeightItem: {
              component: "items",
              ref: "components",
              key: "theme",
              items: {
                rowHeightWrapper: {
                  component: "inline-wrapper",
                  items: {
                    rowHeight: {
                      component: "dropdown",
                      ref: "rowHeight.linesCount",
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
        },
      },
    },
  ],
});

const getRowStylesConfig = () => ({
  type: "items",
  items: {
    nullValueText: {
      ref: "nullValueRepresentation.text",
      type: "string",
      translation: "properties.pivot.nullValueText",
      defaultValue: "-",
    },
    alwaysFullyExpanded: {
      ref: "qHyperCubeDef.qAlwaysFullyExpanded",
      type: "boolean",
      translation: "properties.pivot.fullyExpanded",
      defaultValue: false,
    },
    showTotalsAbove: {
      ref: "qHyperCubeDef.qShowTotalsAbove",
      type: "boolean",
      translation: "properties.pivot.showTotalsAbove",
      defaultValue: true,
      show(properties: EngineAPI.IGenericHyperCubeProperties): boolean {
        return properties.qHyperCubeDef?.qDimensions?.some((qDim) => qDim.qOtherTotalSpec?.qTotalMode === "TOTAL_EXPR");
      },
    },
    // indentMode: {
    //   ref: 'qHyperCubeDef.qIndentMode',
    //   type: 'boolean',
    //   translation: 'properties.pivot.indentMode',
    // },
    resetProperties: {
      type: "object",
      component: "button",
      translation: "properties.pivot.resetExpansionButton",
      disabled(properties: EngineAPI.IGenericHyperCubeProperties): boolean {
        return properties.qHyperCubeDef.qAlwaysFullyExpanded;
      },
      action(properties: ExtendedGenericHyperCubeProperties, _: unknown, __: unknown, emitter: Emitter): void {
        properties.qHyperCubeDef.qExpansionState = []; // eslint-disable-line no-param-reassign
        emitter.$emit("saveProperties", properties);
      },
    },
  },
});

const settings = {
  uses: "settings",
  items: {
    presentation: {
      type: "items",
      translation: "properties.presentation",
      grouped: true,
      items: [getStylingPanelConfig(), getRowStylesConfig()],
    },
  },
};

export default settings;
