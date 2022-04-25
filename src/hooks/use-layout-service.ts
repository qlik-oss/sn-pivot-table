import { useMemo } from '@nebula.js/stardust';
import createLayoutService from '../services/layout-service';
import { PivotLayout } from '../types/QIX';
import { LayoutService } from '../types/types';

const useLayoutService = (layout: PivotLayout): LayoutService => useMemo(() => createLayoutService(layout), [layout]);

export default useLayoutService;
