import { TopDimensionData } from "../../types/types";
import extractTopGrid from "./extract-top";
import assignDistanceToNextCell from "./helpers/assign-next-sibling";
import createDimInfoToIndexMapCallback from "./helpers/dimension-info-to-index-map";

export const addPageToTopDimensionData = (
  prevData: TopDimensionData,
  nextDataPage: EngineAPI.INxPivotPage
): TopDimensionData => {
  const { qTop, qArea } = nextDataPage;
  if (!qTop.length) return prevData;

  const grid = extractTopGrid(prevData.grid, qTop, qArea, false);
  assignDistanceToNextCell(grid, "x");
  const width = Math.max(prevData.size.x, qArea.qWidth + qArea.qLeft);

  return {
    ...prevData,
    grid,
    size: {
      x: width,
      y: grid.length,
    },
  };
};

export const createTopDimensionData = (
  dataPage: EngineAPI.INxPivotPage,
  qHyperCube: EngineAPI.IHyperCube,
  isSnapshot: boolean
): TopDimensionData => {
  const { qArea, qTop } = dataPage;
  const { qEffectiveInterColumnSortOrder, qNoOfLeftDims } = qHyperCube;
  const grid = extractTopGrid([], qTop, qArea, isSnapshot);
  assignDistanceToNextCell(grid, "x");
  const dimensionInfoIndexMap = grid.map(
    createDimInfoToIndexMapCallback(qNoOfLeftDims, qEffectiveInterColumnSortOrder)
  );

  return {
    grid,
    dimensionInfoIndexMap,
    size: {
      x: isSnapshot ? qArea.qWidth : qArea.qWidth + qArea.qLeft,
      y: grid.length,
    },
  };
};
