// import { TOTAL_MODE_ON } from '../../constants';

interface ExtendedVisualizationHyperCubeDef extends EngineAPI.IVisualizationHyperCubeDef {
  qExpansionState: unknown[]
}

export interface ExtendedGenericHyperCubeProperties extends EngineAPI.IGenericHyperCubeProperties {
  qHyperCubeDef: ExtendedVisualizationHyperCubeDef
}

export interface Emitter {
  $emit: (method: string, props: ExtendedGenericHyperCubeProperties) => void
}

const settings = {
  uses: 'settings',
  items: {
    presentation: {
      type: 'items',
      translation: 'properties.presentation',
      grouped: true,
      items: {
        rowStyle: {
          type: 'items',
          items: {
            nullValueText: {
              ref: 'nullValueRepresentation.text',
              type: 'string',
              translation: 'properties.pivot.nullValueText',
              defaultValue: '-',
            },
            alwaysFullyExpanded: {
              ref: 'qHyperCubeDef.qAlwaysFullyExpanded',
              type: 'boolean',
              translation: 'properties.pivot.fullyExpanded',
              defaultValue: false,
            },
            showTotalsAbove: {
              ref: 'qHyperCubeDef.qShowTotalsAbove',
              type: 'boolean',
              translation: 'properties.pivot.showTotalsAbove',
              defaultValue: true,
              show(properties: EngineAPI.IGenericHyperCubeProperties): boolean {
                return properties.qHyperCubeDef?.qDimensions?.some(qDim => qDim.qOtherTotalSpec?.qTotalMode === 'TOTAL_EXPR');
              },
            },
            // indentMode: {
            //   ref: 'qHyperCubeDef.qIndentMode',
            //   type: 'boolean',
            //   translation: 'properties.pivot.indentMode',
            // },
            resetProperties: {
              type: 'object',
              component: 'button',
              translation: 'properties.pivot.resetExpansionButton',
              disabled(properties: EngineAPI.IGenericHyperCubeProperties): boolean {
                return properties.qHyperCubeDef.qAlwaysFullyExpanded;
              },
              action(properties: ExtendedGenericHyperCubeProperties, _: unknown, __: unknown, emitter: Emitter): void {
                properties.qHyperCubeDef.qExpansionState = []; // eslint-disable-line no-param-reassign
                emitter.$emit('saveProperties', properties);
              },
            },
          },
        },
      },
    },
  },
};

export default settings;
