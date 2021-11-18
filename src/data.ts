/* eslint-disable no-param-reassign */
import { GenericObjectLayout, NxDimension } from "./types/QIX";

const updateNbrLeftDims = (definition: GenericObjectLayout) => {
  if (definition.qHyperCubeDef.qDimensions.length <= 2) {
    definition.qHyperCubeDef.qNoOfLeftDims = definition.qHyperCubeDef.qDimensions.length;
  } else {
    definition.qHyperCubeDef.qNoOfLeftDims = 2;
  }
};

export default {
  targets: [
    {
      path: '/qHyperCubeDef',
      dimensions: {
        min: 1,
        max: 15,
        added(dim: NxDimension, definition: GenericObjectLayout): void {
          updateNbrLeftDims(definition);
          // definition.qHyperCubeDef.qNoOfLeftDims = 0;
          console.log('ADDED', dim, definition);
        },
        removed(dim: NxDimension, definition: GenericObjectLayout): void {
          updateNbrLeftDims(definition);
          // definition.qHyperCubeDef.qNoOfLeftDims = 0;
          console.log('REMOVED', dim, definition);
        }
      },
      measures: {
        min: 0,
        max: 15,
      },
      testing: {
        min: 0,
        max: 1,
      }
    },
  ],
};
