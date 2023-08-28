import { useMemo } from "react";
import { PSEUDO_DIMENSION_INDEX } from "../../constants";
import type { ExtendedDimensionInfo } from "../../types/QIX";
import NxDimCellType from "../../types/QIX";
import type { LayoutService, VisibleDimensionInfo } from "../../types/types";

interface UseVisibleDimensions {
  visibleLeftDimensionInfo: VisibleDimensionInfo[];
  visibleTopDimensionInfo: VisibleDimensionInfo[];
}

const typeToDimension =
  (qDimensionInfo: EngineAPI.INxDimensionInfo[], qEffectiveInterColumnSortOrder: number[], startIndex: number) =>
  (type: EngineAPI.NxCellType, index: number) => {
    if (type === NxDimCellType.NX_DIM_CELL_PSEUDO) return PSEUDO_DIMENSION_INDEX;

    const dimIndex = qEffectiveInterColumnSortOrder[startIndex + index];
    return qDimensionInfo[dimIndex] as ExtendedDimensionInfo;
  };

const getVisibleDimensionTypes = (rootNodes: EngineAPI.INxPivotDimensionCell[]) => {
  const types: EngineAPI.NxCellType[] = [];

  const iterateResursivly = (nodes: EngineAPI.INxPivotDimensionCell[], idx = 0) => {
    nodes.slice(0, 1).forEach((node) => {
      types[idx] = node.qType;

      if (node.qSubNodes.length) {
        iterateResursivly(node.qSubNodes, idx + 1);
      }
    });
  };

  iterateResursivly(rootNodes);

  return types;
};

// Consumed by "color by expression", "is dimension locked" and headers
const useVisibleDimensions = (
  layoutService: LayoutService,
  qPivotDataPages: EngineAPI.INxPivotPage[],
): UseVisibleDimensions => {
  const { qHyperCube } = layoutService.layout;
  const { qNoOfLeftDims, qEffectiveInterColumnSortOrder, qDimensionInfo } = qHyperCube;

  return useMemo(() => {
    const visibileLeftTypes = getVisibleDimensionTypes(qPivotDataPages[0]?.qLeft ?? []);
    const visibileTopTypes = getVisibleDimensionTypes(qPivotDataPages[0]?.qTop ?? []);

    const visibleLeftDimensionInfo = visibileLeftTypes.map(
      typeToDimension(qDimensionInfo, qEffectiveInterColumnSortOrder, 0),
    );

    const visibleTopDimensionInfo = visibileTopTypes.map(
      typeToDimension(qDimensionInfo, qEffectiveInterColumnSortOrder, qNoOfLeftDims),
    );

    return {
      visibleLeftDimensionInfo,
      visibleTopDimensionInfo,
    };
  }, [qDimensionInfo, qEffectiveInterColumnSortOrder, qNoOfLeftDims, qPivotDataPages]);
};

export default useVisibleDimensions;
