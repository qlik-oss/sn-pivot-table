import type { LayoutService, TopDimensionData } from "../../types/types";
import extractTopGrid from "./extract-top";
import assignDistanceToNextCell from "./helpers/assign-distance-to-next-cell";
import createDimInfoToIndexMapCallback from "./helpers/dimension-info-to-index-map";

export interface AddPageToTopDimensionDataProps {
  prevData: TopDimensionData;
  nextDataPage: EngineAPI.INxPivotPage;
}

export const addPageToTopDimensionData = ({
  prevData,
  nextDataPage,
}: AddPageToTopDimensionDataProps): TopDimensionData => {
  const { qTop, qArea } = nextDataPage;
  if (!qTop.length) return prevData;

  const grid = extractTopGrid(prevData.grid, qTop, qArea, false);
  assignDistanceToNextCell(grid, "pageX", prevData.layoutSize);

  return {
    ...prevData,
    grid,
    rowCount: grid.length,
  };
};

export const createTopDimensionData = (
  dataPage: EngineAPI.INxPivotPage,
  layoutService: LayoutService
): TopDimensionData => {
  const { qHyperCube } = layoutService.layout;
  const { qArea, qTop } = dataPage;
  const { qEffectiveInterColumnSortOrder, qNoOfLeftDims } = qHyperCube;
  const grid = extractTopGrid([], qTop, qArea, layoutService.isSnapshot);
  assignDistanceToNextCell(grid, "pageX", layoutService.size);
  const dimensionInfoIndexMap = grid.map(
    createDimInfoToIndexMapCallback(qNoOfLeftDims, qEffectiveInterColumnSortOrder)
  );

  return {
    grid,
    dimensionInfoIndexMap,
    rowCount: grid.length,
    layoutSize: layoutService.size,
  };
};
