import { useEffect, useMemo } from "@nebula.js/stardust";
import { createRoot } from "react-dom/client";

const useReactRoot = (rootElement: HTMLElement) => {
  const reactRoot = useMemo(() => createRoot(rootElement), [rootElement]);

  useEffect(() => () => reactRoot.unmount(), [reactRoot]);

  return reactRoot;
};

export default useReactRoot;
