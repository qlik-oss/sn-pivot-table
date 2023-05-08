import type { PageInfo } from "../../hooks/use-pivot-table";
import type { LayoutService, LeftDimensionData } from "../../types/types";
import extractLeftGrid from "./extract-left";
import assignDistanceToNextCell from "./helpers/assign-distance-to-next-cell";
import createDimInfoToIndexMapCallback from "./helpers/dimension-info-to-index-map";

export interface AddPageToLeftDimensionDataProps {
  prevData: LeftDimensionData;
  nextDataPage: EngineAPI.INxPivotPage;
  pageInfo: PageInfo;
  isNewPage?: boolean;
}

export const addPageToLeftDimensionData = ({
  prevData,
  nextDataPage,
  pageInfo,
  isNewPage,
}: AddPageToLeftDimensionDataProps): LeftDimensionData => {
  const { qLeft, qArea } = nextDataPage;
  if (!qLeft.length) return prevData;

  const prevGrid = isNewPage ? [] : prevData.grid;
  const grid = extractLeftGrid(prevGrid, qLeft, qArea, false, isNewPage, pageInfo);
  assignDistanceToNextCell(grid, "y", prevData.layoutSize);

  return {
    ...prevData,
    grid,
    columnCount: grid.length,
  };
};

export const createLeftDimensionData = (
  dataPage: EngineAPI.INxPivotPage,
  layoutService: LayoutService,
  pageInfo: PageInfo
): LeftDimensionData => {
  const { qHyperCube } = layoutService.layout;
  const { qArea, qLeft } = dataPage;
  const { qEffectiveInterColumnSortOrder } = qHyperCube;
  const grid = extractLeftGrid([], qLeft, qArea, layoutService.isSnapshot, false, pageInfo);
  assignDistanceToNextCell(grid, "y", layoutService.size);
  const dimensionInfoIndexMap = grid.map(createDimInfoToIndexMapCallback(0, qEffectiveInterColumnSortOrder));

  return {
    grid,
    dimensionInfoIndexMap,
    columnCount: grid.length,
    layoutSize: layoutService.size,
  };
};
