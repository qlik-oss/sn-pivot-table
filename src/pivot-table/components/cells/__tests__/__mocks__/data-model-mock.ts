import { DataModel } from '../../../../../types/types';

const dataModelMock = (): DataModel => ({
  fetchNextPage: () => {},
  fetchMoreData: () => {},
  collapseLeft: () => {},
  collapseTop: () => {},
  expandLeft: () => {},
  expandTop: () => {},
});

export default dataModelMock;
