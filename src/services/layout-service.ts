import { PSEUDO_DIMENSION_INDEX } from "../constants";
import { MAX_COLUMN_COUNT, MAX_ROW_COUNT } from "../pivot-table/constants";
import { type PivotLayout } from "../types/QIX";
import type { LayoutService } from "../types/types";
import getSortedDimensionInfo from "./utils/get-sorted-dimension-info";

const createLayoutService = (layout: PivotLayout): LayoutService => {
  const { qHyperCube, nullValueRepresentation, snapshotData } = layout;
  const { qNoOfLeftDims, qEffectiveInterColumnSortOrder, qMeasureInfo } = qHyperCube;
  const isSnapshot = !!snapshotData;
  const snapshotDataPage = snapshotData?.content?.qPivotDataPages?.[0]?.qArea ?? { qWidth: 0, qHeight: 0 };
  const size = {
    x: isSnapshot ? snapshotDataPage.qWidth : Math.min(layout.qHyperCube.qSize.qcx, MAX_COLUMN_COUNT),
    y: isSnapshot ? snapshotDataPage.qHeight : Math.min(layout.qHyperCube.qSize.qcy, MAX_ROW_COUNT),
  };
  const { sortedLeftDimensionInfo, sortedTopDimensionInfo } = getSortedDimensionInfo(layout);
  const hasPseudoDimOnLeft = sortedLeftDimensionInfo.some((dimInfo) => dimInfo === PSEUDO_DIMENSION_INDEX);

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
    size,
    isSnapshot,
    hasLimitedData: !isSnapshot && size.x < layout.qHyperCube.qSize.qcx,
    hasLeftDimensions: layout.qHyperCube.qNoOfLeftDims !== 0,
    hasPseudoDimOnLeft,
    // Consumed by "color by expression", "is dimension locked" and headers
    sortedLeftDimensionInfo,
    sortedTopDimensionInfo,
  };
};

export default createLayoutService;
