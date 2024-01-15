import type { SnapshotData } from "../types/QIX";
import type { ViewService, ViewState } from "../types/types";

const createViewService = (viewState: ViewState, snapshotData: SnapshotData | undefined): ViewService => ({
  gridColumnStartIndex: 0,
  gridRowStartIndex: 0,
  gridWidth: 0,
  gridHeight: 0,
  rowPartialHeight: snapshotData?.content?.rowPartialHeight ?? 0,
  visibleTopIndex: snapshotData?.content?.visibleTopIndex ?? viewState?.visibleTopIndex,
  visibleRows: snapshotData?.content?.visibleRows ?? viewState?.visibleRows,
  rowsPerPage: snapshotData?.content?.rowsPerPage ?? viewState?.rowsPerPage,
  page: snapshotData?.content?.page ?? viewState?.page,
  viewState,
});

export default createViewService;
