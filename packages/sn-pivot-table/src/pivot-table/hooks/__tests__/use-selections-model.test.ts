import { COLUMN_ADJUSTER_CLASS } from "@qlik/nebula-table-utils/lib/constants";
import { act, renderHook, waitFor } from "@testing-library/react";
import { Q_PATH } from "../../../constants";
import { NxSelectionCellType } from "../../../types/QIX";
import type { Cell, ExtendedSelections, PageInfo } from "../../../types/types";
import useSelectionsModel from "../use-selections-model";

describe("useSelectionsModel", () => {
  let selections: ExtendedSelections;
  let updatePageInfo: jest.MockedFunction<(args: Partial<PageInfo>) => void>;
  let callbacks: Record<string, () => void>;
  let mouseEvt: React.MouseEvent;
  let isActive = false;

  beforeEach(() => {
    isActive = false;

    selections = {
      on: () => {},
      removeListener: () => {},
      select: () => Promise.resolve(),
      isActive: () => isActive,
      begin: () => {
        isActive = true;
        return Promise.resolve();
      },
    } as unknown as ExtendedSelections;

    callbacks = {};
    updatePageInfo = jest.fn();
    mouseEvt = {} as React.MouseEvent;

    jest.spyOn(selections, "on").mockImplementation((evt, cb) => {
      callbacks[evt] = cb;
    });
    jest.spyOn(selections, "removeListener");
    jest.spyOn(selections, "select");
    jest.spyOn(selections, "isActive");
    jest.spyOn(selections, "begin");
  });

  afterEach(() => {
    callbacks = {};
    jest.resetAllMocks();
  });

  test("should add and remove event listeners", () => {
    const { unmount } = renderHook(() => useSelectionsModel(selections, updatePageInfo));

    expect(selections.on).toHaveBeenCalledWith("deactivated", expect.any(Function));
    expect(selections.on).toHaveBeenCalledWith("canceled", expect.any(Function));
    expect(selections.on).toHaveBeenCalledWith("confirmed", expect.any(Function));
    expect(selections.on).toHaveBeenCalledWith("cleared", expect.any(Function));
    expect(selections.removeListener).toHaveBeenCalledTimes(0);

    unmount();

    expect(selections.removeListener).toHaveBeenCalledWith("deactivated", expect.any(Function));
    expect(selections.removeListener).toHaveBeenCalledWith("canceled", expect.any(Function));
    expect(selections.removeListener).toHaveBeenCalledWith("confirmed", expect.any(Function));
    expect(selections.removeListener).toHaveBeenCalledWith("cleared", expect.any(Function));
  });

  test("should not select cell when mouse event is coming from ColumnAdjuster", async () => {
    const cell = { selectionCellType: NxSelectionCellType.NX_CELL_TOP, x: 1, y: 0, ref: { qElemNo: 1 } } as Cell;
    mouseEvt.target = {
      getAttribute: () => `${COLUMN_ADJUSTER_CLASS} some-other-class`,
    } as unknown as HTMLElement;
    const { result } = renderHook(() => useSelectionsModel(selections, updatePageInfo));

    await act(async () => {
      await result.current.select(cell)(mouseEvt);
    });

    // eslint-disable-next-line @typescript-eslint/unbound-method
    await waitFor(() => expect(selections.begin).toHaveBeenCalledTimes(0));
    await waitFor(() => expect(result.current.isSelected(cell)).toBeFalsy());
  });

  test("should select cell and call begin selection", async () => {
    const cell1 = { selectionCellType: NxSelectionCellType.NX_CELL_TOP, x: 1, y: 0, ref: { qElemNo: 1 } } as Cell;
    const cell2 = { selectionCellType: NxSelectionCellType.NX_CELL_TOP, x: 2, y: 0, ref: { qElemNo: 2 } } as Cell;
    const { result } = renderHook(() => useSelectionsModel(selections, updatePageInfo));

    await act(async () => {
      await result.current.select(cell1)(mouseEvt);
    });

    // eslint-disable-next-line @typescript-eslint/unbound-method
    await waitFor(() => expect(selections.begin).toHaveBeenCalledWith([Q_PATH]));
    await waitFor(() => expect(result.current.isSelected(cell1)).toBeTruthy());
    await act(async () => {
      await result.current.select(cell2)(mouseEvt);
    });
    await waitFor(() => expect(result.current.isSelected(cell2)).toBeTruthy());
    await waitFor(() =>
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(selections.select).toHaveBeenCalledWith({
        method: "selectPivotCells",
        params: [
          Q_PATH,
          [
            {
              qType: cell1.selectionCellType,
              qCol: cell1.x,
              qRow: cell1.y,
            },
            {
              qType: cell2.selectionCellType,
              qCol: cell2.x,
              qRow: cell2.y,
            },
          ],
        ],
      }),
    );
  });

  test("should select cell and not call begin selection when already active", async () => {
    const cell = { selectionCellType: NxSelectionCellType.NX_CELL_TOP, x: 1, y: 0, ref: { qElemNo: 1 } } as Cell;
    const { result } = renderHook(() => useSelectionsModel(selections, updatePageInfo));
    selections.isActive = () => true;

    await act(async () => {
      await result.current.select(cell)(mouseEvt);
    });

    // eslint-disable-next-line @typescript-eslint/unbound-method
    await waitFor(() => expect(selections.begin).toHaveBeenCalledTimes(0));
    await waitFor(() => expect(result.current.isSelected(cell)).toBeTruthy());
  });

  test("should select cell and confirm by calling related callback", async () => {
    const cell = { selectionCellType: NxSelectionCellType.NX_CELL_TOP, x: 1, y: 0, ref: { qElemNo: 1 } } as Cell;
    const { result } = renderHook(() => useSelectionsModel(selections, updatePageInfo));

    await act(async () => {
      await result.current.select(cell)(mouseEvt);

      // trigger confirm callback
      callbacks.confirmed();
    });

    await waitFor(() => expect(updatePageInfo).toHaveBeenCalledTimes(1));
  });

  test("should de-select cell", async () => {
    const cell = { selectionCellType: NxSelectionCellType.NX_CELL_TOP, x: 1, y: 0, ref: { qElemNo: 1 } } as Cell;
    const { result } = renderHook(() => useSelectionsModel(selections, updatePageInfo));

    await act(async () => {
      await result.current.select(cell)(mouseEvt);
    });

    await waitFor(() => expect(result.current.isSelected(cell)).toBeTruthy());

    await act(async () => {
      await result.current.select(cell)(mouseEvt);
    });

    await waitFor(() => expect(result.current.isSelected(cell)).toBeFalsy());
  });

  test("should lock cells with qType=T when qType=L is already selected", async () => {
    const cellTop = { selectionCellType: NxSelectionCellType.NX_CELL_TOP, x: 0, y: 0, ref: { qElemNo: 0 } } as Cell;
    const cellLeft = { selectionCellType: NxSelectionCellType.NX_CELL_LEFT, x: 0, y: 0, ref: { qElemNo: 0 } } as Cell;
    const { result } = renderHook(() => useSelectionsModel(selections, updatePageInfo));

    await act(async () => {
      await result.current.select(cellLeft)(mouseEvt);
    });

    await waitFor(() => expect(result.current.isLocked(cellTop)).toBeTruthy());
    await waitFor(() => expect(result.current.isLocked(cellLeft)).toBeFalsy());
  });

  test("should lock cells with qType=T and not on the same row", async () => {
    const cell1 = { selectionCellType: NxSelectionCellType.NX_CELL_TOP, x: 0, y: 0, ref: { qElemNo: 0 } } as Cell;
    const cell2 = { selectionCellType: NxSelectionCellType.NX_CELL_TOP, x: 0, y: 1, ref: { qElemNo: 0 } } as Cell;
    const { result } = renderHook(() => useSelectionsModel(selections, updatePageInfo));

    await act(async () => {
      await result.current.select(cell1)(mouseEvt);
    });

    await waitFor(() => expect(result.current.isLocked(cell1)).toBeFalsy());
    await waitFor(() => expect(result.current.isLocked(cell2)).toBeTruthy());
  });

  test("should lock cells with qType=L when qType=T is already selected", async () => {
    const cellTop = { selectionCellType: NxSelectionCellType.NX_CELL_TOP, x: 0, y: 0, ref: { qElemNo: 0 } } as Cell;
    const cellLeft = { selectionCellType: NxSelectionCellType.NX_CELL_LEFT, x: 0, y: 0, ref: { qElemNo: 0 } } as Cell;
    const { result } = renderHook(() => useSelectionsModel(selections, updatePageInfo));

    await act(async () => {
      await result.current.select(cellTop)(mouseEvt);
    });

    await waitFor(() => expect(result.current.isLocked(cellLeft)).toBeTruthy());
    await waitFor(() => expect(result.current.isLocked(cellTop)).toBeFalsy());
  });

  test("should lock cells with qType=L and not on the same column", async () => {
    const cell1 = { selectionCellType: NxSelectionCellType.NX_CELL_LEFT, x: 0, y: 0, ref: { qElemNo: 0 } } as Cell;
    const cell2 = { selectionCellType: NxSelectionCellType.NX_CELL_LEFT, x: 1, y: 0, ref: { qElemNo: 1 } } as Cell;
    const { result } = renderHook(() => useSelectionsModel(selections, updatePageInfo));

    await act(async () => {
      await result.current.select(cell1)(mouseEvt);
    });

    await waitFor(() => expect(result.current.isLocked(cell1)).toBeFalsy());
    await waitFor(() => expect(result.current.isLocked(cell2)).toBeTruthy());
  });

  test("should not be possible to select a cell if it's locked", async () => {
    const cellLeft = { selectionCellType: NxSelectionCellType.NX_CELL_LEFT, x: 0, y: 0, ref: { qElemNo: 0 } } as Cell;
    const cellTop = { selectionCellType: NxSelectionCellType.NX_CELL_TOP, x: 1, y: 0, ref: { qElemNo: 1 } } as Cell;
    const { result } = renderHook(() => useSelectionsModel(selections, updatePageInfo));

    await act(async () => {
      await result.current.select(cellLeft)(mouseEvt);
    });

    await waitFor(() => expect(result.current.isLocked(cellTop)).toBeTruthy());
    await act(async () => {
      await result.current.select(cellTop)(mouseEvt);
    });
    // eslint-disable-next-line @typescript-eslint/unbound-method
    await waitFor(() => expect(selections.select).toHaveBeenCalledTimes(1));
    await waitFor(() => expect(result.current.isSelected(cellTop)).toBeFalsy());
  });

  test("should handle when select method fails", async () => {
    jest.spyOn(console, "error");
    const cell = { selectionCellType: NxSelectionCellType.NX_CELL_TOP, x: 1, y: 0, ref: { qElemNo: 1 } } as Cell;
    const { result } = renderHook(() => useSelectionsModel(selections, updatePageInfo));
    const err = new Error("FAIL");
    selections.select = () => Promise.reject(err);

    await act(async () => {
      await result.current.select(cell)(mouseEvt);
    });
    await waitFor(() => expect(result.current.isSelected(cell)).toBeFalsy());
    // eslint-disable-next-line no-console
    await waitFor(() => expect(console.error).toHaveBeenCalledWith(err));
  });

  test("should not lock cell when there are not active selections", async () => {
    const cell = { selectionCellType: NxSelectionCellType.NX_CELL_TOP, x: 1, y: 0, ref: { qElemNo: 1 } } as Cell;
    const { result } = renderHook(() => useSelectionsModel(selections, updatePageInfo));

    await waitFor(() => expect(result.current.isLocked(cell)).toBeFalsy());
  });
});
