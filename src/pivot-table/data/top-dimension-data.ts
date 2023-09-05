import type { LayoutService, TopDimensionData, VisibleDimensionInfo } from "../../types/types";
import extractTopGrid from "./extract-top";
import assignDistanceToNextCell from "./helpers/assign-distance-to-next-cell";

export interface AddPageToTopDimensionDataProps {
  prevData: TopDimensionData;
  nextDataPage: EngineAPI.INxPivotPage;
  layoutService: LayoutService;
  visibleTopDimensionInfo: VisibleDimensionInfo[];
}

export const addPageToTopDimensionData = ({
  prevData,
  nextDataPage,
  layoutService,
  visibleTopDimensionInfo,
}: AddPageToTopDimensionDataProps): TopDimensionData => {
  const { qTop, qArea } = nextDataPage;
  if (!qTop.length) return prevData;

  const grid = extractTopGrid(prevData.grid, qTop, qArea, layoutService, visibleTopDimensionInfo);
  assignDistanceToNextCell(grid, "pageX", prevData.layoutSize);

  return {
    ...prevData,
    grid,
    rowCount: grid.length,
  };
};

export const createTopDimensionData = (
  dataPage: EngineAPI.INxPivotPage,
  layoutService: LayoutService,
  visibleTopDimensionInfo: VisibleDimensionInfo[],
): TopDimensionData => {
  const { qArea, qTop } = dataPage;
  const grid = extractTopGrid([], qTop, qArea, layoutService, visibleTopDimensionInfo);
  assignDistanceToNextCell(grid, "pageX", layoutService.size);

  return {
    grid,
    rowCount: grid.length,
    layoutSize: layoutService.size,
  };
};
