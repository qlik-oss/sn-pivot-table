import { DataModel } from '../../../../../types/types';

const dataModelMock = (): DataModel => ({
  pivotData: {
    qDataPages: [],
    data: [],
    left: [],
    leftGrid: [],
    top: [],
    topGrid: [],
    headers: [],
    leftDimensionInfoIndexMap: [],
    topDimensionInfoIndexMap: [],
    size: {
      data: { x: 0, y: 0 },
      headers: { x: 0, y: 0 },
      left: { x: 0, y: 0 },
      top: { x: 0, y: 0 },
      totalRows: 0,
      totalColumns: 0
    }
  },
  fetchNextPage: () => {},
  fetchMoreData: () => {},
  hasMoreColumns: false,
  hasMoreRows: false,
  collapseLeft: () => {},
  collapseTop: () => {},
  expandLeft: () => {},
  expandTop: () => {},
  hasData: true,
});

export default dataModelMock;
