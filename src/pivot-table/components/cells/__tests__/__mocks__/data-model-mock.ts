import { DataModel } from '../../../../../types/types';

const dataModelMock = (): DataModel => ({
  fetchNextPage: () => Promise.resolve(true),
  fetchMoreData: () => Promise.resolve(true),
  collapseLeft: () => {},
  collapseTop: () => {},
  expandLeft: () => {},
  expandTop: () => {},
});

export default dataModelMock;
