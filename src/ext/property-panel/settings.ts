// import { TOTAL_MODE_ON } from '../../constants';

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
      key: "theme",
      defaultValue: [],
      items: {
        numlinesSection: {
          translation: "ThemeStyleEditor.style.rowHeight",
          component: "panel-section",
          items: {
            numlinesItem: {
              component: "items",
              ref: "components",
              key: "general",
              items: {
                numlinesWrapper: {
                  component: "inline-wrapper",
                  items: {
                    numlines: {
                      component: "dropdown",
                      ref: "numlines.linesCount",
                      translation: "ThemeStyleEditor.style.rowHeight",
                      options: [
                        {
                          value: 1,
                          translation: 1,
                        },
                        {
                          value: 2,
                          translation: 2,
                        },
                        {
                          value: 3,
                          translation: 3,
                        },
                        {
                          value: 4,
                          translation: 4,
                        },
                        {
                          value: 5,
                          translation: 5,
                        },
                      ],
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
