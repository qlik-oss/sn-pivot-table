/* eslint-disable no-param-reassign */

const updateNbrLeftDims = (definition: EngineAPI.IGenericObjectProperties) => {
  if (definition.qHyperCubeDef.qDimensions.length <= 2) {
    definition.qHyperCubeDef.qNoOfLeftDims = definition.qHyperCubeDef.qDimensions.length;
  } else {
    definition.qHyperCubeDef.qNoOfLeftDims = 2;
  }
};

const updateInterColumnSortOrder = (def: EngineAPI.IGenericObjectProperties) => {
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
        added(dim: EngineAPI.INxDimension, def: EngineAPI.IGenericObjectProperties): void {
          updateNbrLeftDims(def);
          updateInterColumnSortOrder(def);
          console.log('DIMENSION ADDED', dim, def);
        },
        removed(dim: EngineAPI.INxDimension, def: EngineAPI.IGenericObjectProperties): void {
          updateNbrLeftDims(def);
          updateInterColumnSortOrder(def);
          console.log('DIMENSION REMOVED', dim, def);
        }
      },
      measures: {
        min: 0,
        max: 15,
        added(dim: EngineAPI.INxMeasure, def: EngineAPI.IGenericObjectProperties): void {
          updateInterColumnSortOrder(def);
          console.log('MEASURE ADDED', dim, def);
        },
        removed(dim: EngineAPI.INxMeasure, def: EngineAPI.IGenericObjectProperties): void {
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
