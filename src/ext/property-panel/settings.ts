// import { TOTAL_MODE_ON } from '../../constants';

import { stardust } from '@nebula.js/stardust';

interface ExtendedVisualizationHyperCubeDef extends EngineAPI.IVisualizationHyperCubeDef {
  qExpansionState: unknown[]
}

interface ExtendedGenericHyperCubeProperties extends EngineAPI.IGenericHyperCubeProperties {
  qHyperCubeDef: ExtendedVisualizationHyperCubeDef
}

interface Emitter {
  $emit: (method: string, props: ExtendedGenericHyperCubeProperties) => void
}

export default function create({ flags: { isEnabled } }: stardust.Galaxy): Record<string, unknown> {
  return {
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
              alwaysFullyExpanded: {
                ref: 'qHyperCubeDef.qAlwaysFullyExpanded',
                type: 'boolean',
                translation: 'properties.pivot.fullyExpanded',
                defaultValue: false,
              },
              showTotalsAbove: {
                ref: 'qHyperCubeDef.qShowTotalsAbove',
                type: 'boolean',
                translation: 'properties.pivot.qShowTotalsAbove', // TODO translate
                defaultValue: false,
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
                show: isEnabled('USE_PIVOT_STATE'),
                disabled(properties: EngineAPI.IGenericHyperCubeProperties) {
                  return properties.qHyperCubeDef.qAlwaysFullyExpanded;
                },
                action(properties: ExtendedGenericHyperCubeProperties, _: unknown, __: unknown, emitter: Emitter) {
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
}
