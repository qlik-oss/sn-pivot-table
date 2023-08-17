import { usePromise } from "@nebula.js/stardust";
import type { Model, PivotLayout } from "../types/QIX";

const useEffectiveProperties = (model: Model, layout: PivotLayout) =>
  usePromise<EngineAPI.IGenericObjectProperties | undefined>(async () => {
    if (layout.snapshotData) {
      // Is snapshot
      return {} as EngineAPI.IGenericObjectProperties;
    }

    return (model as EngineAPI.IGenericObject).getEffectiveProperties();
  }, [model, layout]);

export default useEffectiveProperties;
