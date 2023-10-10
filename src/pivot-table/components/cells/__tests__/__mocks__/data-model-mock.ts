import type { DataModel } from "../../../../../types/types";

const dataModelMock = (): DataModel => ({
  fetchMoreData: () => Promise.resolve(),
  collapseLeft: () => {},
  collapseTop: () => {},
  expandLeft: () => {},
  expandTop: () => {},
  applyColumnWidth: () => {},
});

export default dataModelMock;
