import type { Model } from "../types/QIX";
import type { Column, SortDirection } from "../types/types";

interface UseSortingApi {
  changeSortOrder: (column: Column, newSortDirection: SortDirection) => Promise<boolean>;
}

interface UseSorting {
  (model: Model): UseSortingApi;
}

const useSorting: UseSorting = (model) => {
  const api = {
    changeSortOrder: async (column: Column, newSortDirection: SortDirection) => {
      if (!model) throw new Error("No Model provided!");

      const { isDim, colIdx, qReverseSort } = column;
      const patches: EngineAPI.INxPatch[] = [];

      if ((newSortDirection === "D" && !qReverseSort) || (newSortDirection === "A" && qReverseSort)) {
        patches.push({
          qPath: `/qHyperCubeDef/${isDim ? "qDimensions" : "qMeasures"}/${colIdx}/qDef/qReverseSort`,
          qOp: "Replace",
          qValue: (!qReverseSort).toString(),
        });
      }

      try {
        await model.applyPatches(patches, true);
        return true;
      } catch (error) {
        console.error("Error while applying patch: ", error);
        return false;
      }
    },
  };

  return api;
};

export default useSorting;
