import { useMemo } from "@nebula.js/stardust";
import createViewService from "../services/view-service";
import type { PageInfo, ViewService } from "../types/types";

const useViewService = (pageInfo: PageInfo): ViewService => useMemo(() => createViewService(), [pageInfo.currentPage]);

export default useViewService;
