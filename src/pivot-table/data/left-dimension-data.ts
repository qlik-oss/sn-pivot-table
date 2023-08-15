import type { LayoutService, LeftDimensionData, PageInfo, VisibleDimensionInfo } from "../../types/types";
import extractLeftGrid from "./extract-left";
import assignDistanceToNextCell from "./helpers/assign-distance-to-next-cell";

export interface AddPageToLeftDimensionDataProps {
  prevData: LeftDimensionData;
  nextDataPage: EngineAPI.INxPivotPage;
  pageInfo: PageInfo;
  isNewPage?: boolean;
  layoutService: LayoutService;
  visibleLeftDimensionInfo: VisibleDimensionInfo[];
}

export const addPageToLeftDimensionData = ({
  prevData,
  nextDataPage,
  pageInfo,
  layoutService,
  visibleLeftDimensionInfo,
}: AddPageToLeftDimensionDataProps): LeftDimensionData => {
  const { qLeft, qArea } = nextDataPage;
  if (!qLeft.length) return prevData;

  const grid = extractLeftGrid(prevData.grid, qLeft, qArea, pageInfo, layoutService, visibleLeftDimensionInfo);
  assignDistanceToNextCell(grid, "pageY", prevData.layoutSize, pageInfo);

  return {
    ...prevData,
    grid,
    columnCount: grid.length,
  };
};

export const createLeftDimensionData = (
  dataPage: EngineAPI.INxPivotPage,
  layoutService: LayoutService,
  pageInfo: PageInfo,
  visibleLeftDimensionInfo: VisibleDimensionInfo[]
): LeftDimensionData => {
  const { qArea, qLeft } = dataPage;
  const grid = extractLeftGrid([], qLeft, qArea, pageInfo, layoutService, visibleLeftDimensionInfo);
  assignDistanceToNextCell(grid, "pageY", layoutService.size, pageInfo);

  return {
    grid,
    columnCount: grid.length,
    layoutSize: layoutService.size,
  };
};
