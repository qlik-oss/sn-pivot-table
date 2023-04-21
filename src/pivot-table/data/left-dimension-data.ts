import { LeftDimensionData } from "../../types/types";
import extractLeftGrid from "./extract-left";
import assignDistanceToNextCell from "./helpers/assign-next-sibling";
import createDimInfoToIndexMapCallback from "./helpers/dimension-info-to-index-map";

export const addPageToLeftDimensionData = (
  prevData: LeftDimensionData,
  nextDataPage: EngineAPI.INxPivotPage
): LeftDimensionData => {
  const { qLeft, qArea } = nextDataPage;
  if (!qLeft.length) return prevData;

  const grid = extractLeftGrid(prevData.grid, qLeft, qArea, false);
  assignDistanceToNextCell(grid, "y");
  const height = Math.max(prevData.size.y, qArea.qHeight + qArea.qTop);

  return {
    ...prevData,
    grid,
    size: {
      x: grid.length,
      y: height,
    },
  };
};

export const createLeftDimensionData = (
  dataPage: EngineAPI.INxPivotPage,
  qHyperCube: EngineAPI.IHyperCube,
  isSnapshot: boolean
): LeftDimensionData => {
  const { qArea, qLeft } = dataPage;
  const { qEffectiveInterColumnSortOrder } = qHyperCube;
  const grid = extractLeftGrid([], qLeft, qArea, isSnapshot);
  assignDistanceToNextCell(grid, "y");
  const dimensionInfoIndexMap = grid.map(createDimInfoToIndexMapCallback(0, qEffectiveInterColumnSortOrder));

  return {
    grid,
    dimensionInfoIndexMap,
    size: {
      x: grid.length,
      y: isSnapshot ? qArea.qHeight : qArea.qHeight + qArea.qTop,
    },
  };
};
