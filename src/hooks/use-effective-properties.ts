import { usePromise } from "@nebula.js/stardust";
import type { Model, PivotLayout } from "../types/QIX";

const useEffectiveProperties = (model: Model, layout: PivotLayout) =>
  usePromise<EngineAPI.IGenericObjectProperties | undefined>(async () => {
    if (model === undefined || layout.snapshotData || !("getEffectiveProperties" in model)) {
      // Is snapshot
      return {} as EngineAPI.IGenericObjectProperties;
    }

    return model.getEffectiveProperties();
  }, [model, layout]);

export default useEffectiveProperties;
