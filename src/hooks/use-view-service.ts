import { useMemo } from "@nebula.js/stardust";
import type { PivotLayout, SnapshotData } from "../types/QIX";
import type { PageInfo, ViewService } from "../types/types";

const createViewService = (snapshotData: SnapshotData | undefined): ViewService => ({
  gridColumnStartIndex: 0,
  gridRowStartIndex: 0,
  gridWidth: 0,
  gridHeight: 0,
  rowPartialHeight: snapshotData?.content?.rowPartialHeight ?? 0,
  visibleRows: snapshotData?.content?.visibleRows,
  // visibleTopIndex: snapshotData?.content?.visibleTopIndex,
  // rowsPerPage: snapshotData?.content?.rowsPerPage,
  // page: snapshotData?.content?.page,
});

const useViewService = (layout: PivotLayout, pageInfo: PageInfo): ViewService =>
  useMemo(
    () => createViewService(layout.snapshotData),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [layout.snapshotData, pageInfo.page],
  );

export default useViewService;
