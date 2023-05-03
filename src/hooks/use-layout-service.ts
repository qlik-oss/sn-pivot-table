import { useMemo } from "@nebula.js/stardust";
import createLayoutService from "../services/layout-service";
import type { PivotLayout } from "../types/QIX";
import type { LayoutService } from "../types/types";

const useLayoutService = (layout: PivotLayout): LayoutService => useMemo(() => createLayoutService(layout), [layout]);

export default useLayoutService;
