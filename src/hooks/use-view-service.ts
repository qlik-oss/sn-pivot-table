import { useMemo } from "@nebula.js/stardust";
import createViewService from "../services/view-service";
import type { PivotLayout } from "../types/QIX";
import type { PageInfo, ViewService } from "../types/types";

const useViewService = (layout: PivotLayout, pageInfo: PageInfo): ViewService =>
  useMemo(
    () => createViewService(layout.snapshotData),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [layout.snapshotData, pageInfo.page],
  );

export default useViewService;
