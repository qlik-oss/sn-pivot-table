import { useMemo } from "react";
import type { ExtendedHyperCube, Model } from "../../types/QIX";
import type { ChangeActivelySortedHeader, ChangeSortOrder, Header, SortDirection } from "../../types/types";

interface UseSortingApi {
  changeSortOrder: ChangeSortOrder;
  changeActivelySortedHeader: ChangeActivelySortedHeader;
}

interface UseSorting {
  (model: Model, hyperCube: ExtendedHyperCube): UseSortingApi;
}

const useSorting: UseSorting = (model, qHyperCube) => {
  const api = useMemo(
    () => ({
      changeSortOrder: async (header: Header, newSortDirection: SortDirection) => {
        if (!model) throw new Error("No Model provided!");

        const { colIdx, qReverseSort } = header;
        const patches: EngineAPI.INxPatch[] = [];

        if ((newSortDirection === "D" && !qReverseSort) || (newSortDirection === "A" && qReverseSort)) {
          patches.push({
            qPath: `/qHyperCubeDef/qDimensions/${colIdx}/qDef/qReverseSort`,
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

      changeActivelySortedHeader: async (header: Header) => {
        if (!model) throw new Error("No Model provided!");

        const { colIdx, qLibraryId, fieldId, sortDirection } = header;
        const isActivelySortedColExists = !!qHyperCube.activelySortedColumn;
        const patch: EngineAPI.INxPatch[] = [
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
    }),
    [model, qHyperCube.activelySortedColumn],
  );

  return api;
};

export default useSorting;
