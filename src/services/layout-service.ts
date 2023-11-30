import { PSEUDO_DIMENSION_INDEX } from "../constants";
import { MAX_COLUMN_COUNT, MAX_ROW_COUNT } from "../pivot-table/constants";
import { type PivotLayout } from "../types/QIX";
import type { LayoutService, VisibleDimensionInfo } from "../types/types";

const createLayoutService = (
  layout: PivotLayout,
  effectiveProperties: EngineAPI.IGenericObjectProperties | undefined,
): LayoutService => {
  const { qHyperCube, nullValueRepresentation, snapshotData } = layout;
  const { qNoOfLeftDims, qEffectiveInterColumnSortOrder, qMeasureInfo, qDimensionInfo } = qHyperCube;
  const isSnapshot = !!snapshotData;
  const snapshotDataPage = snapshotData?.content?.qPivotDataPages?.[0]?.qArea ?? { qWidth: 0, qHeight: 0 };
  const size = {
    x: isSnapshot ? snapshotDataPage.qWidth : Math.min(layout.qHyperCube.qSize.qcx, MAX_COLUMN_COUNT),
    y: isSnapshot ? snapshotDataPage.qHeight : Math.min(layout.qHyperCube.qSize.qcy, MAX_ROW_COUNT),
  };
  const leftDimensionInfoIndexes = qEffectiveInterColumnSortOrder.slice(0, qNoOfLeftDims);
  const isLeftDimension = (dimensionInfoIndex: number) =>
    leftDimensionInfoIndexes.some((index) => index === dimensionInfoIndex);
  const hasPseudoDimOnLeft = isLeftDimension(PSEUDO_DIMENSION_INDEX);
  const dimensionInfoIndexMap: Map<VisibleDimensionInfo, number> = new Map(
    qEffectiveInterColumnSortOrder.map((index) => [qDimensionInfo[index] ?? PSEUDO_DIMENSION_INDEX, index]),
  );

  return {
    layout,
    getNullValueText: () => nullValueRepresentation?.text ?? "-",
    getMeasureInfoIndexFromCellIndex: (index: number) => {
      if (hasPseudoDimOnLeft) {
        return 0;
      }

      return index % qMeasureInfo.length;
    },
    getDimensionInfo: (index: number): VisibleDimensionInfo | undefined =>
      index === PSEUDO_DIMENSION_INDEX
        ? PSEUDO_DIMENSION_INDEX
        : qDimensionInfo[qEffectiveInterColumnSortOrder[index]] ?? undefined,
    getDimensionInfoIndex: (info: VisibleDimensionInfo) => dimensionInfoIndexMap.get(info) ?? -1,
    size,
    isSnapshot,
    hasLimitedData: !isSnapshot && size.x < layout.qHyperCube.qSize.qcx,
    hasData: size.x > 0 && size.y > 0,
    hasLeftDimensions: layout.qHyperCube.qNoOfLeftDims !== 0,
    // qShowTotalsAbove is not available on the layout, so it's read from effective properties instead.
    // If not available in the effective properties, assume that it's set to false.
    showTotalsAbove: !!effectiveProperties?.qHyperCubeDef?.qShowTotalsAbove,
    hasPseudoDimOnLeft,
    leftDimensionInfoIndexes,
    isLeftDimension,
    isFullyExpanded: !!effectiveProperties?.qHyperCubeDef?.qAlwaysFullyExpanded,
    // qLastExpandedPos only exist in the layout if a new layout was received because a node was expanded or collapsed
    triggerdByExpandOrCollapse: !!layout.qHyperCube.qLastExpandedPos,
  };
};

export default createLayoutService;
