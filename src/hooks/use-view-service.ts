import { useMemo, useState } from '@nebula.js/stardust';
import createViewService from '../services/view-service';
import { ViewService } from '../types/types';

const useViewService = (): ViewService => {
  const [instance, setInstance] = useState({} as ViewService);

  useMemo(() => setInstance(createViewService()), []);

  return instance;
};

export default useViewService;
