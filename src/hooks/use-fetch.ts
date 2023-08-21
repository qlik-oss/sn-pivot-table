import { usePromise } from "@nebula.js/stardust";

export default function useFetch<T>(
  fetch: () => Promise<T>,
  deps: unknown[]
): [result: T | undefined, isLoading: boolean, error: Error | undefined] {
  const [response, error] = usePromise(async () => {
    const result = await fetch();
    console.log("%c result", "color: orangered", result);
    return {
      result,
      deps,
    };
  }, deps);

  const isLoading = response === undefined || response.deps.some((dep, idx) => dep !== deps[idx]);

  console.log("%c isLoading", "color: orange", isLoading);

  return [response?.result, isLoading, error];
}
