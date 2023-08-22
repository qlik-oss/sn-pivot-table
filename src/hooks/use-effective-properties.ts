import type { Model, PivotLayout } from "../types/QIX";
import useFetch from "./use-fetch";

const useEffectiveProperties = (model: Model, layout: PivotLayout) =>
  useFetch<EngineAPI.IGenericObjectProperties | undefined>(async () => {
    if (model === undefined || layout.snapshotData || !("getEffectiveProperties" in model)) {
      // Is snapshot
      return undefined;
    }

    return model.getEffectiveProperties();
  }, [model, layout]);

export default useEffectiveProperties;
