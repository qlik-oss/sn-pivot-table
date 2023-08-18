import * as nebula from "@nebula.js/stardust";
import { renderHook, waitFor } from "@testing-library/react";
import type { Model, PivotLayout, SnapshotData } from "../../types/QIX";
import useEffectiveProperties from "../use-effective-properties";

jest.mock("@nebula.js/stardust");

describe("useEffectiveProperties", () => {
  let model: Model;
  let layout: PivotLayout;
  let effectiveProperties: EngineAPI.IGenericObjectProperties;

  beforeEach(() => {
    const usePromiseMock = (factory: () => Promise<unknown>) => [factory()] as unknown as [unknown, Error];
    jest.spyOn(nebula, "usePromise").mockImplementation(usePromiseMock);

    effectiveProperties = {
      qShowTotalsAbove: true,
    } as unknown as EngineAPI.IGenericObjectProperties;
    layout = {} as PivotLayout;

    model = {
      getEffectiveProperties: () => Promise.resolve(effectiveProperties),
    } as Model;
  });

  test("should fetch and return effective properties", async () => {
    effectiveProperties = {} as EngineAPI.IGenericObjectProperties;
    const { result } = renderHook(() => useEffectiveProperties(model, layout));

    await waitFor(async () => {
      const [pendingProps] = result.current;
      const props = await (pendingProps as unknown as Promise<EngineAPI.IGenericObjectProperties>);

      expect(props).toBe(effectiveProperties);
    });
  });

  test("should not fetch effective properties for a snapshot", async () => {
    effectiveProperties = {} as EngineAPI.IGenericObjectProperties;
    layout.snapshotData = {} as SnapshotData;
    const { result } = renderHook(() => useEffectiveProperties(model, layout));

    await waitFor(async () => {
      const [pendingProps] = result.current;
      const props = await (pendingProps as unknown as Promise<EngineAPI.IGenericObjectProperties>);

      expect(props).toEqual({});
    });
  });

  test("should not fetch effective properties when model is undefined", async () => {
    effectiveProperties = {} as EngineAPI.IGenericObjectProperties;
    layout.snapshotData = {} as SnapshotData;
    const { result } = renderHook(() => useEffectiveProperties(undefined, layout));

    await waitFor(async () => {
      const [pendingProps] = result.current;
      const props = await (pendingProps as unknown as Promise<EngineAPI.IGenericObjectProperties>);

      expect(props).toEqual({});
    });
  });

  test("should not fetch effective properties when model does not have getEffectiveProperties method", async () => {
    effectiveProperties = {} as EngineAPI.IGenericObjectProperties;
    layout.snapshotData = {} as SnapshotData;
    model = {} as EngineAPI.IGenericBookmark;
    const { result } = renderHook(() => useEffectiveProperties(model, layout));

    await waitFor(async () => {
      const [pendingProps] = result.current;
      const props = await (pendingProps as unknown as Promise<EngineAPI.IGenericObjectProperties>);

      expect(props).toEqual({});
    });
  });
});
