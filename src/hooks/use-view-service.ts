import { useMemo } from '@nebula.js/stardust';
import createViewService from '../services/view-service';
import { ViewService } from '../types/types';

const useViewService = (): ViewService => useMemo(() => createViewService(), []);

export default useViewService;
