import { useMemo } from "@nebula.js/stardust";
import createViewService from "../services/view-service";
import type { PageInfo, ViewService } from "../types/types";

// eslint-disable-next-line react-hooks/exhaustive-deps
const useViewService = (pageInfo: PageInfo): ViewService => useMemo(() => createViewService(), [pageInfo.page]);

export default useViewService;
