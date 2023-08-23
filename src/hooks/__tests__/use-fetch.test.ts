import { renderHook, waitFor } from "@testing-library/react";
import useFetch from "../use-fetch";

describe("useFetch", () => {
  test("should return is loading state while fetch is in progress", async () => {
    const { result } = renderHook(() => useFetch(() => Promise.resolve(), ["deps"]));

    await waitFor(() => {
      expect(result.current[0]).toBe(undefined);
      expect(result.current[1]).toBe(true);
      expect(result.current[2]).toBe(undefined);
    });
  });

  test("should return is loading state while fetch is completed", async () => {
    const { result } = renderHook(() => useFetch(() => Promise.resolve(), ["deps"]));

    await waitFor(() => {
      expect(result.current[0]).toBe(undefined);
      expect(result.current[1]).toBe(false);
      expect(result.current[2]).toBe(undefined);
    });
  });

  test("should handle rejected promise", async () => {
    const error = new Error("test");
    const { result } = renderHook(() => useFetch(() => Promise.reject(error), ["deps"]));

    await waitFor(() => {
      expect(result.current[0]).toBe(undefined);
      expect(result.current[1]).toBe(false);
      expect(result.current[2]).toBe(error);
    });
  });

  test("should handle when an error is thrown", async () => {
    const error = new Error("test");
    const { result } = renderHook(() =>
      useFetch(() => {
        throw error;
      }, ["deps"])
    );

    await waitFor(() => {
      expect(result.current[0]).toBe(undefined);
      expect(result.current[1]).toBe(false);
      expect(result.current[2]).toBe(error);
    });
  });

  test("should return fetched data", async () => {
    const data = "testing";
    const { result } = renderHook(() => useFetch(() => Promise.resolve(data), ["deps"]));

    await waitFor(() => {
      expect(result.current[0]).toBe(data);
      expect(result.current[1]).toBe(false);
      expect(result.current[2]).toBe(undefined);
    });
  });

  test("should handle undefined data", async () => {
    const data = undefined;
    const { result } = renderHook(() => useFetch(() => Promise.resolve(data), ["deps"]));

    await waitFor(() => {
      expect(result.current[0]).toBe(data);
      expect(result.current[1]).toBe(false);
      expect(result.current[2]).toBe(undefined);
    });
  });

  test("should handle when an error is thrown on first render and then resolved", async () => {
    const error = new Error("test");
    const throwOnFirstRender = () => {
      throw error;
    };
    const { result, rerender } = renderHook(
      ({ cb, deps }: { cb: () => Promise<unknown>; deps: unknown[] } = { cb: throwOnFirstRender, deps: ["deps"] }) =>
        useFetch(cb, deps)
    );

    await waitFor(() => {
      expect(result.current[0]).toBe(undefined);
      expect(result.current[1]).toBe(false);
      expect(result.current[2]).toBe(error);
    });

    rerender({ cb: () => Promise.resolve("test"), deps: ["new deps"] });

    await waitFor(() => {
      expect(result.current[0]).toBe(undefined);
      expect(result.current[1]).toBe(true);
      expect(result.current[2]).toBe(error);
    });

    await waitFor(() => {
      expect(result.current[0]).toBe("test");
      expect(result.current[1]).toBe(false);
      expect(result.current[2]).toBe(undefined);
    });
  });
});
