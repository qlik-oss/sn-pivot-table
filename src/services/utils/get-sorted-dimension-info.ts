import { PSEUDO_DIMENSION_INDEX } from "../../constants";
import type { ExtendedDimensionInfo, PivotLayout, PseudoDimension } from "../../types/QIX";

const filterPseudoAndVisibleDimensions = (qDim: ExtendedDimensionInfo | -1) =>
  qDim === PSEUDO_DIMENSION_INDEX || qDim.qCardinalities.qHypercubeCardinal > 0;

const getSortedDimensionInfo = (layout: PivotLayout) => {
  const { qHyperCube } = layout;
  const { qNoOfLeftDims, qEffectiveInterColumnSortOrder, qDimensionInfo } = qHyperCube;

  const sortedDimensionInfo = qEffectiveInterColumnSortOrder.map((index) => {
    if (index === PSEUDO_DIMENSION_INDEX) return PSEUDO_DIMENSION_INDEX;

    return qDimensionInfo[index];
  }) as (ExtendedDimensionInfo | PseudoDimension)[];

  const sortedLeftDimensionInfo = sortedDimensionInfo.slice(0, qNoOfLeftDims).filter(filterPseudoAndVisibleDimensions);
  const sortedTopDimensionInfo = sortedDimensionInfo.slice(qNoOfLeftDims).filter(filterPseudoAndVisibleDimensions);

  return {
    sortedLeftDimensionInfo,
    sortedTopDimensionInfo,
  };
};

export default getSortedDimensionInfo;
