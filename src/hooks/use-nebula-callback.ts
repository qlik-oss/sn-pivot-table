import { useMemo } from "@nebula.js/stardust";

export default function useNebulaCallback<T>(callback: T, deps: unknown[]): T {
  return useMemo(() => callback, deps);
}
