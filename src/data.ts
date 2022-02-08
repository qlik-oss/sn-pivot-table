/* eslint-disable no-param-reassign */
import { GenericObjectLayout, NxDimension, NxMeasure } from './types/QIX';

const updateNbrLeftDims = (definition: GenericObjectLayout) => {
  if (definition.qHyperCubeDef.qDimensions.length <= 2) {
    definition.qHyperCubeDef.qNoOfLeftDims = definition.qHyperCubeDef.qDimensions.length;
  } else {
    definition.qHyperCubeDef.qNoOfLeftDims = 2;
  }
};

const updateInterColumnSortOrder = (def: GenericObjectLayout) => {
  const measureCount = def.qHyperCubeDef.qMeasures.length;
  const dimCount = def.qHyperCubeDef.qDimensions.length;
  def.qHyperCubeDef.qInterColumnSortOrder = Array(dimCount).fill(null).map((nil, i) => i);
  if (measureCount > 1) {
    def.qHyperCubeDef.qInterColumnSortOrder.sort().splice(dimCount, measureCount, -1);
  }
  console.log('qInterColumnSortOrder', def.qHyperCubeDef.qInterColumnSortOrder);
};

export default {
  targets: [
    {
      path: '/qHyperCubeDef',
      dimensions: {
        min: 1,
        max: 15,
        added(dim: NxDimension, def: GenericObjectLayout): void {
          updateNbrLeftDims(def);
          updateInterColumnSortOrder(def);
          console.log('DIMENSION ADDED', dim, def);
        },
        removed(dim: NxDimension, def: GenericObjectLayout): void {
          updateNbrLeftDims(def);
          updateInterColumnSortOrder(def);
          console.log('DIMENSION REMOVED', dim, def);
        }
      },
      measures: {
        min: 0,
        max: 15,
        added(dim: NxMeasure, def: GenericObjectLayout): void {
          updateInterColumnSortOrder(def);
          console.log('MEASURE ADDED', dim, def);
        },
        removed(dim: NxMeasure, def: GenericObjectLayout): void {
          updateInterColumnSortOrder(def);
          console.log('MEASURE REMOVED', dim, def);
        }
      },
      testing: {
        min: 0,
        max: 1,
      }
    },
  ],
};
