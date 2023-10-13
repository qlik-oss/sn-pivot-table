import type { SortDirection } from "@qlik/nebula-table-utils/lib/components/HeadCellMenu/types";
import { renderHook } from "@testing-library/react";
import type { ExtendedHyperCube, Model } from "../../../types/QIX";
import type { HeaderCell } from "../../../types/types";
import useSorting from "../use-sorting";

describe("use-sorting", () => {
  let model: Model;
  let applyPatches: jest.MockedFunction<() => Promise<void>>;
  let hyperCube: ExtendedHyperCube;

  let header: HeaderCell;
  let newSortDirection: SortDirection;

  const renderer = () => renderHook(() => useSorting(model, hyperCube)).result.current;

  beforeEach(() => {
    applyPatches = jest.fn();
    model = { applyPatches } as unknown as Model;
    hyperCube = { qDimensionInfo: [{}, {}, {}] } as unknown as ExtendedHyperCube;

    header = { isDim: true, colIdx: 0, qReverseSort: false } as HeaderCell;
    newSortDirection = "A";
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe("changeSortOrder", () => {
    test("should throw error if there was no model", async () => {
      model = undefined as unknown as Model;
      const { changeSortOrder } = renderer();
      let msg = "";
      try {
        await changeSortOrder(header, newSortDirection);
      } catch (err: unknown) {
        msg = (err as Error).message;
      }
      expect(msg).toBe("No Model provided!");
    });

    test("should call applyPatches with correct patch object for Ascensing sort", async () => {
      const { changeSortOrder } = renderer();
      newSortDirection = "A";
      header.qReverseSort = true;
      await changeSortOrder(header, newSortDirection);
      expect(applyPatches).toHaveBeenCalledTimes(1);
      expect(applyPatches).toHaveBeenCalledWith(
        [
          {
            qOp: "Replace",
            qPath: `/qHyperCubeDef/qDimensions/${header.colIdx}/qDef/qReverseSort`,
            qValue: String(!header.qReverseSort),
          },
        ],
        true,
      );
    });

    test("should call applyPatches with correct patch object for Descending sort", async () => {
      const { changeSortOrder } = renderer();
      newSortDirection = "D";
      await changeSortOrder(header, newSortDirection);
      expect(applyPatches).toHaveBeenCalledTimes(1);
      expect(applyPatches).toHaveBeenCalledWith(
        [
          {
            qOp: "Replace",
            qPath: `/qHyperCubeDef/qDimensions/${header.colIdx}/qDef/qReverseSort`,
            qValue: String(!header.qReverseSort),
          },
        ],
        true,
      );
    });

    test("should log error if applyPatches fails", async () => {
      jest.spyOn(console, "error");
      applyPatches.mockRejectedValue("failure");
      const { changeSortOrder } = renderer();
      newSortDirection = "A";
      await changeSortOrder(header, newSortDirection);
      expect(applyPatches).toHaveBeenCalledTimes(1);
      expect(console.error).toHaveBeenCalledTimes(1);
    });
  });

  describe("changeActivelySortedHeader", () => {
    let expectedHeaderObject: HeaderCell;
    beforeEach(() => {
      header = {
        ...header,
        qLibraryId: "#someLibraryId",
        fieldId: "#someFieldId",
      };
      expectedHeaderObject = {
        colIdx: header.colIdx,
        qLibraryId: header.qLibraryId,
        fieldId: header.fieldId,
        sortDirection: header.sortDirection,
      } as HeaderCell;
    });

    test("should throw error if there was no model", async () => {
      model = undefined as unknown as Model;
      const { changeActivelySortedHeader } = renderer();
      let msg = "";
      try {
        await changeActivelySortedHeader(header);
      } catch (err: unknown) {
        msg = (err as Error).message;
      }
      expect(msg).toBe("No Model provided!");
    });

    test("should call applyPatches using correct operation if `activelySortedColumn` is already exists on hypercube", async () => {
      hyperCube = { ...hyperCube, activelySortedColumn: {} } as ExtendedHyperCube;
      const { changeActivelySortedHeader } = renderer();
      newSortDirection = "D";
      header.isDim = false;
      await changeActivelySortedHeader(header);
      expect(applyPatches).toHaveBeenCalledTimes(1);
      expect(applyPatches).toHaveBeenCalledWith(
        [
          {
            qOp: "Replace",
            qPath: "/qHyperCubeDef/activelySortedColumn",
            qValue: JSON.stringify({ ...expectedHeaderObject, colIdx: header.colIdx }),
          },
        ],
        true,
      );
    });

    test("should call applyPatches with correct patch object for Ascensing sort", async () => {
      const { changeActivelySortedHeader } = renderer();
      newSortDirection = "A";
      header.qReverseSort = true;
      await changeActivelySortedHeader(header);
      expect(applyPatches).toHaveBeenCalledTimes(1);
      expect(applyPatches).toHaveBeenCalledWith(
        [
          {
            qOp: "Add",
            qPath: "/qHyperCubeDef/activelySortedColumn",
            qValue: JSON.stringify(expectedHeaderObject),
          },
        ],
        true,
      );
    });

    test("should call applyPatches with correct patch object for Descending sort", async () => {
      const { changeActivelySortedHeader } = renderer();
      newSortDirection = "D";
      await changeActivelySortedHeader(header);
      expect(applyPatches).toHaveBeenCalledTimes(1);
      expect(applyPatches).toHaveBeenCalledWith(
        [
          {
            qOp: "Add",
            qPath: "/qHyperCubeDef/activelySortedColumn",
            qValue: JSON.stringify(expectedHeaderObject),
          },
        ],
        true,
      );
    });

    test("should log error if applyPatches fails", async () => {
      jest.spyOn(console, "error");
      applyPatches.mockRejectedValue("failure");
      const { changeActivelySortedHeader } = renderer();
      newSortDirection = "A";
      await changeActivelySortedHeader(header);
      expect(applyPatches).toHaveBeenCalledTimes(1);
      expect(console.error).toHaveBeenCalledTimes(1);
    });
  });
});
