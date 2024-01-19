import { useMemo } from "@nebula.js/stardust";

export default function useNebulaCallback<T>(callback: T, deps: unknown[]): T {
  // This is not a react hook
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useMemo(() => callback, deps);
}
