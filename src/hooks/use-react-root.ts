import { useEffect, useMemo } from '@nebula.js/stardust';
import { createRoot } from 'react-dom/client';

const useReactRoot = (rootElement: HTMLElement) => {
  const reactRoot = useMemo(() => {
    return createRoot(rootElement);
  }, [rootElement]);

  useEffect(() => {
    // Cleanup
    return () => {
      reactRoot.unmount();
    }
  }, [reactRoot]);

  return reactRoot;
}

export default useReactRoot;
