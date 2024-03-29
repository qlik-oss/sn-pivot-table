import type {
  AttrExprInfoIndex,
  LayoutService,
  LeftDimensionData,
  PageInfo,
  VisibleDimensionInfo,
} from "../../types/types";
import extractLeftGrid from "./extract-left";
import assignDistanceToNextCell from "./helpers/assign-distance-to-next-cell";
import getTotalDividerIndex from "./helpers/get-total-divider-index";

export interface AddPageToLeftDimensionDataProps {
  prevData: LeftDimensionData;
  nextDataPage: EngineAPI.INxPivotPage;
  pageInfo: PageInfo;
  isNewPage?: boolean;
  layoutService: LayoutService;
  visibleLeftDimensionInfo: VisibleDimensionInfo[];
  attrExprInfoIndexes: AttrExprInfoIndex[];
}

export const addPageToLeftDimensionData = ({
  prevData,
  nextDataPage,
  pageInfo,
  layoutService,
  visibleLeftDimensionInfo,
  attrExprInfoIndexes,
}: AddPageToLeftDimensionDataProps): LeftDimensionData => {
  const { qLeft, qArea } = nextDataPage;
  if (!qLeft.length) return prevData;

  const grid = extractLeftGrid(
    prevData.grid,
    qLeft,
    qArea,
    pageInfo,
    layoutService,
    visibleLeftDimensionInfo,
    attrExprInfoIndexes,
  );
  assignDistanceToNextCell(grid, pageInfo.rowsOnCurrentPage);
  const totalDividerIndex = getTotalDividerIndex(grid);

  return {
    ...prevData,
    grid,
    columnCount: grid.length,
    totalDividerIndex,
  };
};

export const createLeftDimensionData = (
  dataPage: EngineAPI.INxPivotPage,
  layoutService: LayoutService,
  pageInfo: PageInfo,
  visibleLeftDimensionInfo: VisibleDimensionInfo[],
  attrExprInfoIndexes: AttrExprInfoIndex[],
): LeftDimensionData => {
  const { qArea, qLeft } = dataPage;
  const grid = extractLeftGrid(
    [],
    qLeft,
    qArea,
    pageInfo,
    layoutService,
    visibleLeftDimensionInfo,
    attrExprInfoIndexes,
  );
  assignDistanceToNextCell(grid, pageInfo.rowsOnCurrentPage);
  const totalDividerIndex = getTotalDividerIndex(grid);

  return {
    grid,
    columnCount: grid.length,
    layoutSize: layoutService.size,
    totalDividerIndex,
  };
};
