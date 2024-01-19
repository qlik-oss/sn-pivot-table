import { useMemo } from "@nebula.js/stardust";

const nonInitializedValue = {};

const useNebulaRef = <T>(value: T) => {
  const ref = useMemo<{ current: T }>(() => ({ current: nonInitializedValue as T }), []);
  ref.current = ref.current === nonInitializedValue ? value : ref.current;

  return ref;
};

export default useNebulaRef;
