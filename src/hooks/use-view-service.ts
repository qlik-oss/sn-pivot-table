import { useMemo, useOptions } from "@nebula.js/stardust";
import createViewService from "../services/view-service";
import type { PivotLayout } from "../types/QIX";
import type { PageInfo, UseOptions, ViewService } from "../types/types";

const useViewService = (layout: PivotLayout, pageInfo: PageInfo): ViewService => {
  const { viewState } = useOptions() as UseOptions;
  return useMemo(
    () => createViewService(viewState, layout.snapshotData),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [viewState, layout.snapshotData, pageInfo.page],
  );
};

export default useViewService;
