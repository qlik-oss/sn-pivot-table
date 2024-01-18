import { useMemo, useOptions } from "@nebula.js/stardust";
import createViewService from "../services/view-service";
import type { PivotLayout } from "../types/QIX";
import type { PageInfo, UseOptions, ViewService } from "../types/types";

// eslint-disable-next-line react-hooks/exhaustive-deps
const useViewService = (layout: PivotLayout, pageInfo: PageInfo): ViewService => {
  const { viewState } = useOptions() as UseOptions;
  // TODO: fix the dependencies conflict, apparently pageInfo.page is no longer counted as the useMemo dependency
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useMemo(() => createViewService(viewState, layout), [pageInfo.page, layout.snapshotData]);
};

export default useViewService;
