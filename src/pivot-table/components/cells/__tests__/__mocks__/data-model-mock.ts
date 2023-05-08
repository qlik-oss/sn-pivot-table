import type { DataModel } from "../../../../../types/types";

const dataModelMock = (): DataModel => ({
  fetchMoreData: () => Promise.resolve(true),
  fetchNewPage: () => Promise.resolve(true),
  collapseLeft: () => {},
  collapseTop: () => {},
  expandLeft: () => {},
  expandTop: () => {},
  isLoading: false,
});

export default dataModelMock;
