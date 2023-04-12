import { PSEUDO_DIMENSION_INDEX } from "../constants";
import { NxSelectionCellType, PivotLayout } from "../types/QIX";
import { LayoutService } from "../types/types";

const createLayoutService = (layout: PivotLayout): LayoutService => {
  const { qHyperCube, nullValueRepresentation } = layout;
  const { qNoOfLeftDims, qEffectiveInterColumnSortOrder, qMeasureInfo, qDimensionInfo } = qHyperCube;
  const leftDimensions = qDimensionInfo.slice(0, qNoOfLeftDims);
  const topDimensions = qDimensionInfo.slice(qNoOfLeftDims);

  return {
    layout,
    getNullValueText: () => nullValueRepresentation?.text ?? "-",
    getMeasureInfoIndexFromCellIndex: (index: number) => {
      const pIndex = qEffectiveInterColumnSortOrder.findIndex((num) => num === PSEUDO_DIMENSION_INDEX);
      if (pIndex < qNoOfLeftDims) {
        return 0;
      }

      return index % qMeasureInfo.length;
    },
    isDimensionLocked: (qType: EngineAPI.NxSelectionCellType, qRow: number, qCol: number) => {
      if (qType === NxSelectionCellType.NX_CELL_LEFT) {
        return !!leftDimensions[qCol]?.qLocked;
      }

      if (qType === NxSelectionCellType.NX_CELL_TOP) {
        return !!topDimensions[qRow]?.qLocked;
      }

      return false;
    },
  };
};

export default createLayoutService;
