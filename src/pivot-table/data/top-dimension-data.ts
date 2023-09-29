import type { LayoutService, TopDimensionData, VisibleDimensionInfo } from "../../types/types";
import extractTopGrid from "./extract-top";
import assignDistanceToNextCell from "./helpers/assign-distance-to-next-cell";
import getTotalDividerIndex from "./helpers/get-total-divider-index";

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
  assignDistanceToNextCell(grid, layoutService.size.x);
  const totalDividerIndex = getTotalDividerIndex(grid);

  return {
    ...prevData,
    grid,
    rowCount: grid.length,
    totalDividerIndex,
  };
};

export const createTopDimensionData = (
  dataPage: EngineAPI.INxPivotPage,
  layoutService: LayoutService,
  visibleTopDimensionInfo: VisibleDimensionInfo[],
): TopDimensionData => {
  const { qArea, qTop } = dataPage;
  const grid = extractTopGrid([], qTop, qArea, layoutService, visibleTopDimensionInfo);
  assignDistanceToNextCell(grid, layoutService.size.x);
  const totalDividerIndex = getTotalDividerIndex(grid);

  return {
    grid,
    rowCount: grid.length,
    layoutSize: layoutService.size,
    totalDividerIndex,
  };
};
