// import { TOTAL_MODE_ON } from '../../constants';

import type { stardust } from "@nebula.js/stardust";
import { getStylingPanelConfig } from "./styling-panel";

interface ExtendedVisualizationHyperCubeDef extends EngineAPI.IVisualizationHyperCubeDef {
  qExpansionState: unknown[];
}

export interface ExtendedGenericHyperCubeProperties extends EngineAPI.IGenericHyperCubeProperties {
  qHyperCubeDef: ExtendedVisualizationHyperCubeDef;
}

export interface Emitter {
  $emit: (method: string, props: ExtendedGenericHyperCubeProperties) => void;
}

export const getRowStylesConfig = () => ({
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

const settings = (translator: stardust.Translator) => ({
  uses: "settings",
  items: {
    presentation: {
      type: "items",
      translation: "properties.presentation",
      grouped: true,
      items: [getStylingPanelConfig(translator), getRowStylesConfig()],
    },
  },
});

export default settings;
