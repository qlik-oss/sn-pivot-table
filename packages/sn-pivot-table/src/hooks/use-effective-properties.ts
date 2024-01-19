import { useFetch } from "@qlik/nebula-table-utils/lib/hooks";
import type { Model, PivotLayout } from "../types/QIX";

const useEffectiveProperties = (model: Model, layout: PivotLayout) =>
  useFetch<EngineAPI.IGenericObjectProperties | undefined>(async () => {
    if (model === undefined || layout.snapshotData || !("getEffectiveProperties" in model)) {
      // Is snapshot
      return undefined;
    }

    return model.getEffectiveProperties();
  }, [model, layout]);

export default useEffectiveProperties;
