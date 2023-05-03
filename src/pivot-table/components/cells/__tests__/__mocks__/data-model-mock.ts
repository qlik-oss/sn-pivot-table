import type { DataModel } from "../../../../../types/types";

const dataModelMock = (): DataModel => ({
  fetchMoreData: () => Promise.resolve(true),
  collapseLeft: () => {},
  collapseTop: () => {},
  expandLeft: () => {},
  expandTop: () => {},
});

export default dataModelMock;
