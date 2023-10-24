import { act, renderHook, waitFor } from "@testing-library/react";
import { NxSelectionCellType } from "../../../types/QIX";
import type { ExtendedSelections, PageInfo } from "../../../types/types";
import useSelectionsModel from "../use-selections-model";

describe("useSelectionsModel", () => {
  let selections: ExtendedSelections;
  let updatePageInfo: jest.MockedFunction<(args: Partial<PageInfo>) => void>;
  let callbacks: Record<string, () => void>;
  let mouseEvt: React.MouseEvent;

  beforeEach(() => {
    selections = {
      on: () => {},
      removeListener: () => {},
      select: () => Promise.resolve(),
      isActive: () => false,
      begin: () => Promise.resolve(),
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
    mouseEvt.target = {
      className: "sn-pivot-table-column-adjuster",
    } as HTMLElement;
    const { result } = renderHook(() => useSelectionsModel(selections, updatePageInfo));

    await act(async () => {
      await result.current.select(NxSelectionCellType.NX_CELL_TOP, 0, 1)(mouseEvt);
    });

    // eslint-disable-next-line @typescript-eslint/unbound-method
    await waitFor(() => expect(selections.begin).toHaveBeenCalledTimes(0));
    await waitFor(() => expect(result.current.isSelected(NxSelectionCellType.NX_CELL_TOP, 0, 1)).toBeFalsy());
  });

  test("should select cell and call begin selection", async () => {
    const { result } = renderHook(() => useSelectionsModel(selections, updatePageInfo));

    await act(async () => {
      await result.current.select(NxSelectionCellType.NX_CELL_TOP, 0, 1)(mouseEvt);
      await result.current.select(NxSelectionCellType.NX_CELL_TOP, 0, 2)(mouseEvt);
    });

    // eslint-disable-next-line @typescript-eslint/unbound-method
    await waitFor(() => expect(selections.begin).toHaveBeenCalled());
    await waitFor(() => expect(result.current.isSelected(NxSelectionCellType.NX_CELL_TOP, 0, 1)).toBeTruthy());
    await waitFor(() => expect(result.current.isSelected(NxSelectionCellType.NX_CELL_TOP, 0, 2)).toBeTruthy());
  });

  test("should select cell and not call begin selection when already active", async () => {
    selections.isActive = () => true;
    const { result } = renderHook(() => useSelectionsModel(selections, updatePageInfo));

    await act(async () => {
      await result.current.select(NxSelectionCellType.NX_CELL_TOP, 0, 1)(mouseEvt);
    });

    // eslint-disable-next-line @typescript-eslint/unbound-method
    await waitFor(() => expect(selections.begin).toHaveBeenCalledTimes(0));
    await waitFor(() => expect(result.current.isSelected(NxSelectionCellType.NX_CELL_TOP, 0, 1)).toBeTruthy());
  });

  test("should select cell and confirm by calling related callback", async () => {
    selections.isActive = () => true;
    const { result } = renderHook(() => useSelectionsModel(selections, updatePageInfo));

    await act(async () => {
      await result.current.select(NxSelectionCellType.NX_CELL_TOP, 0, 1)(mouseEvt);

      // trigger confirm callback
      callbacks.confirmed();
    });

    await waitFor(() => expect(updatePageInfo).toHaveBeenCalledTimes(1));
  });

  test("should de-select cell", async () => {
    const { result } = renderHook(() => useSelectionsModel(selections, updatePageInfo));

    await act(async () => {
      await result.current.select(NxSelectionCellType.NX_CELL_TOP, 0, 1)(mouseEvt);
    });

    await waitFor(() => expect(result.current.isSelected(NxSelectionCellType.NX_CELL_TOP, 0, 1)).toBeTruthy());

    await act(async () => {
      await result.current.select(NxSelectionCellType.NX_CELL_TOP, 0, 1)(mouseEvt);
    });

    await waitFor(() => expect(result.current.isSelected(NxSelectionCellType.NX_CELL_TOP, 0, 1)).toBeFalsy());
  });

  test("should not select lock cell type", async () => {
    const { result } = renderHook(() => useSelectionsModel(selections, updatePageInfo));

    await act(async () => {
      await result.current.select(NxSelectionCellType.NX_CELL_TOP, 0, 1)(mouseEvt);
    });

    await waitFor(() => expect(result.current.isSelected(NxSelectionCellType.NX_CELL_TOP, 0, 1)).toBeTruthy());

    await act(async () => {
      await result.current.select(NxSelectionCellType.NX_CELL_LEFT, 0, 1)(mouseEvt);
    });

    await waitFor(() => expect(result.current.isSelected(NxSelectionCellType.NX_CELL_LEFT, 0, 1)).toBeFalsy());
  });

  test("should lock cells with qType=T when qType=L is already selected", async () => {
    const { result } = renderHook(() => useSelectionsModel(selections, updatePageInfo));

    await act(async () => {
      await result.current.select(NxSelectionCellType.NX_CELL_LEFT, 0, 1)(mouseEvt);
    });

    await waitFor(() => expect(result.current.isLocked(NxSelectionCellType.NX_CELL_TOP, 0, 1)).toBeTruthy());
    await waitFor(() => expect(result.current.isLocked(NxSelectionCellType.NX_CELL_LEFT, 0, 1)).toBeFalsy());
  });

  test("should lock cells with qType=T and not on the same row", async () => {
    const { result } = renderHook(() => useSelectionsModel(selections, updatePageInfo));

    await act(async () => {
      await result.current.select(NxSelectionCellType.NX_CELL_TOP, 0, 1)(mouseEvt);
    });

    await waitFor(() => expect(result.current.isLocked(NxSelectionCellType.NX_CELL_TOP, 0, 1)).toBeFalsy());
    await waitFor(() => expect(result.current.isLocked(NxSelectionCellType.NX_CELL_TOP, 1, 1)).toBeTruthy());
  });

  test("should lock cells with qType=L when qType=T is already selected", async () => {
    const { result } = renderHook(() => useSelectionsModel(selections, updatePageInfo));

    await act(async () => {
      await result.current.select(NxSelectionCellType.NX_CELL_TOP, 0, 1)(mouseEvt);
    });

    await waitFor(() => expect(result.current.isLocked(NxSelectionCellType.NX_CELL_LEFT, 0, 1)).toBeTruthy());
    await waitFor(() => expect(result.current.isLocked(NxSelectionCellType.NX_CELL_TOP, 0, 1)).toBeFalsy());
  });

  test("should lock cells with qType=L and not on the same column", async () => {
    const { result } = renderHook(() => useSelectionsModel(selections, updatePageInfo));

    await act(async () => {
      await result.current.select(NxSelectionCellType.NX_CELL_LEFT, 0, 0)(mouseEvt);
    });

    await waitFor(() => expect(result.current.isLocked(NxSelectionCellType.NX_CELL_LEFT, 0, 0)).toBeFalsy());
    await waitFor(() => expect(result.current.isLocked(NxSelectionCellType.NX_CELL_LEFT, 0, 1)).toBeTruthy());
  });

  test("should not lock unknown cell type", () => {
    const { result } = renderHook(() => useSelectionsModel(selections, updatePageInfo));

    expect(result.current.isLocked(NxSelectionCellType.NX_CELL_DATA, 0, 0)).toBeFalsy();
  });
});
