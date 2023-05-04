import { PSEUDO_DIMENSION_INDEX } from "../constants";
import { MAX_COLUMN_COUNT } from "../pivot-table/constants";
import { NxSelectionCellType, type PivotLayout } from "../types/QIX";
import type { LayoutService } from "../types/types";

const createLayoutService = (layout: PivotLayout): LayoutService => {
  const { qHyperCube, nullValueRepresentation, snapshotData } = layout;
  const { qNoOfLeftDims, qEffectiveInterColumnSortOrder, qMeasureInfo, qDimensionInfo } = qHyperCube;
  const leftDimensions = qDimensionInfo.slice(0, qNoOfLeftDims);
  const topDimensions = qDimensionInfo.slice(qNoOfLeftDims);
  const isSnapshot = !!snapshotData;
  const snapshotDataPage = snapshotData?.content?.qPivotDataPages?.[0]?.qArea ?? { qWidth: 0, qHeight: 0 };
  const size = {
    x: isSnapshot ? snapshotDataPage.qWidth : Math.min(layout.qHyperCube.qSize.qcx, MAX_COLUMN_COUNT),
    y: isSnapshot ? snapshotDataPage.qHeight : layout.qHyperCube.qSize.qcy,
  };

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
    size,
    isSnapshot,
    hasLimitedData: !isSnapshot && size.x < layout.qHyperCube.qSize.qcx,
    hasLeftDimensions: layout.qHyperCube.qNoOfLeftDims !== 0,
  };
};

export default createLayoutService;
