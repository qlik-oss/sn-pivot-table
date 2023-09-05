import { useMemo, usePromise } from "@nebula.js/stardust";

export default function useFetch<T>(
  fetch: () => Promise<T>,
  deps: unknown[],
): [result: T | undefined, isLoading: boolean, error: Error | undefined] {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const ref = useMemo<{ isLoading: boolean }>(() => ({ isLoading: true }), deps);

  const [response, error] = usePromise(async () => {
    try {
      return await fetch();
    } finally {
      ref.isLoading = false;
    }
  }, deps);

  return [response, ref.isLoading, error];
}
