import type { stardust } from "@nebula.js/stardust";
import { COLUMN_ADJUSTER_CLASS } from "@qlik/nebula-table-utils/lib/constants";
import { renderHook } from "@testing-library/react";
import { act } from "react-dom/test-utils";
import type { DataModel } from "../../../types/types";
import { useHeadCellDim } from "../use-head-cell-dim";

describe("UseHeadCellDim", () => {
  let interactions: stardust.Interactions;
  let evt: React.MouseEvent;
  let dataModel: DataModel;

  beforeEach(() => {
    interactions = { active: true };
    evt = {} as React.MouseEvent;
    dataModel = {} as DataModel;
  });

  const renderer = () => renderHook(() => useHeadCellDim({ interactions, dataModel })).result;

  test("should return initial open state", () => {
    const result = renderer();
    expect(result.current.open).toBe(false);
  });

  test("handleOpenMenu should set open state to true", () => {
    const result = renderer();

    act(() => {
      result.current.handleOpenMenu(evt);
    });

    expect(result.current.open).toBe(true);
  });

  test("handleOpenMenu should not set open state to true when interactions active is disabled", () => {
    interactions.active = false;
    const result = renderer();

    act(() => {
      result.current.handleOpenMenu(evt);
    });

    expect(result.current.open).toBe(false);
  });

  test("handleOpenMenu should not set open state to true when event is coming from column adjuster", () => {
    evt.target = { getAttribute: () => COLUMN_ADJUSTER_CLASS } as unknown as EventTarget;
    const result = renderer();

    act(() => {
      result.current.handleOpenMenu(evt);
    });

    expect(result.current.open).toBe(false);
  });

  test("handleOpenMenu should not set open state to true when isAdjustingWidth is true", async () => {
    const result = renderer();

    await act(async () => {
      result.current.setIsAdjustingWidth(true);
    });

    act(() => {
      result.current.handleOpenMenu(evt);
    });

    expect(result.current.open).toBe(false);
  });

  test("setOpen should set open state", () => {
    const result = renderer();

    act(() => {
      result.current.setOpen(true);
    });

    expect(result.current.open).toBe(true);
  });
});
