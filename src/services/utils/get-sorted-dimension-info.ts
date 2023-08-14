import { PSEUDO_DIMENSION_INDEX } from "../../constants";
import type { ExtendedDimensionInfo, PivotLayout, PseudoDimension } from "../../types/QIX";
import NxDimCellType from "../../types/QIX";

const getNodeTypes = (rootNodes: EngineAPI.INxPivotDimensionCell[]) => {
  const types: EngineAPI.NxCellType[] = [];

  const iterateResursively = (nodes: EngineAPI.INxPivotDimensionCell[], idx = 0) => {
    nodes.forEach((node) => {
      types[idx] = node.qType;

      if (node.qSubNodes.length) {
        iterateResursively(node.qSubNodes, idx + 1);
      }
    });
  };

  iterateResursively(rootNodes);

  return types;
};

const getSortedDimensionInfo = (layout: PivotLayout) => {
  const { qHyperCube } = layout;
  const { qNoOfLeftDims, qEffectiveInterColumnSortOrder, qDimensionInfo } = qHyperCube;

  const sortedDimensionInfo = qEffectiveInterColumnSortOrder.map((index) => {
    if (index === PSEUDO_DIMENSION_INDEX) return PSEUDO_DIMENSION_INDEX;

    return qDimensionInfo[index];
  }) as (ExtendedDimensionInfo | PseudoDimension)[];

  const visibileLeftTypes = getNodeTypes(qHyperCube.qPivotDataPages[0].qLeft);
  const visibileTopTypes = getNodeTypes(qHyperCube.qPivotDataPages[0].qTop);

  const sortedLeftDimensionInfo = sortedDimensionInfo.slice(0, qNoOfLeftDims);
  const visibleLeftDimensionInfo = visibileLeftTypes.map((type, index) => {
    if (type === NxDimCellType.NX_DIM_CELL_PSEUDO) return PSEUDO_DIMENSION_INDEX;

    return sortedLeftDimensionInfo[index];
  });

  const sortedTopDimensionInfo = sortedDimensionInfo.slice(qNoOfLeftDims);
  const visibleTopDimensionInfo = visibileTopTypes.map((type, index) => {
    if (type === NxDimCellType.NX_DIM_CELL_PSEUDO) return PSEUDO_DIMENSION_INDEX;

    return sortedTopDimensionInfo[index];
  });

  console.log("%c sorted", "color: orangered", layout.title, {
    sortedLeftDimensionInfo,
    sortedTopDimensionInfo,
    layout,
  });

  return {
    sortedLeftDimensionInfo: visibleLeftDimensionInfo,
    sortedTopDimensionInfo: visibleTopDimensionInfo,
  };
};

export default getSortedDimensionInfo;
