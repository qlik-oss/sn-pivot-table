import type { SnapshotData } from "../types/QIX";
import type { ViewService } from "../types/types";

const createViewService = (snapshotData: SnapshotData | undefined): ViewService => ({
  gridColumnStartIndex: 0,
  gridRowStartIndex: 0,
  gridWidth: 0,
  gridHeight: 0,
  rowPartialHeight: snapshotData?.content?.rowPartialHeight ?? 0,
  visibleTopIndex: snapshotData?.content?.visibleTopIndex,
  visibleRows: snapshotData?.content?.visibleRows,
  rowsPerPage: snapshotData?.content?.rowsPerPage,
  page: snapshotData?.content?.page,
});
export default createViewService;
