import type { DataModel } from "../../../../../types/types";

const dataModelMock = (): DataModel => ({
  fetchPages: () => Promise.resolve(),
  collapseLeft: () => {},
  collapseTop: () => {},
  expandLeft: () => {},
  expandTop: () => {},
  applyColumnWidth: () => {},
});

export default dataModelMock;
