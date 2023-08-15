import type { HyperCube, Model } from "../types/QIX";
import type { ChangeActivelySortedColumn, ChangeSortOrder, Column, SortDirection } from "../types/types";

interface UseSortingApi {
  changeSortOrder: ChangeSortOrder;
  changeActivelySortedColumn: ChangeActivelySortedColumn;
}

interface UseSorting {
  (model: Model, hyperCube: HyperCube): UseSortingApi;
}

const useSorting: UseSorting = (model, qHyperCube) => {
  const api = {
    changeSortOrder: async (column: Column, newSortDirection: SortDirection) => {
      if (!model) throw new Error("No Model provided!");

      const { isDim, colIdx, qReverseSort } = column;
      const patches: EngineAPI.INxPatch[] = [];
      const index = isDim ? colIdx : colIdx - qHyperCube.qDimensionInfo.length;

      if ((newSortDirection === "D" && !qReverseSort) || (newSortDirection === "A" && qReverseSort)) {
        patches.push({
          qPath: `/qHyperCubeDef/${isDim ? "qDimensions" : "qMeasures"}/${index}/qDef/qReverseSort`,
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

    changeActivelySortedColumn: async (column: Column) => {
      if (!model) throw new Error("No Model provided!");

      const { colIdx, qLibraryId, fieldId, sortDirection } = column;
      const isActivelySortedColExists = qHyperCube.activelySortedColumn;
      let patch: EngineAPI.INxPatch[] = [];

      patch = [
        {
          qPath: `/qHyperCubeDef/activelySortedColumn`,
          qOp: isActivelySortedColExists ? "Replace" : "Add",
          qValue: JSON.stringify({ colIdx, qLibraryId, fieldId, sortDirection }),
        },
      ];

      try {
        await model?.applyPatches(patch, true);
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
