import { renderHook, waitFor } from "@testing-library/react";
import useWaitForFonts from "../use-wait-for-fonts";

// jest.mock("@nebula.js/stardust");

describe("useWaitForFonts", () => {
  let loadSpy: jest.SpyInstance<Promise<FontFace[]>, [font: string, text?: string | undefined], unknown>;

  beforeEach(() => {
    loadSpy = jest.spyOn(global.document.fonts, "load");
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  test("should return true when fonts have been loaded", async () => {
    const { result } = renderHook(() => useWaitForFonts(["12px Arial", "600 12px Arial"]));

    await waitFor(() => {
      expect(result.current).toBe(true);

      expect(loadSpy).toHaveBeenCalledWith("12px Arial");
      expect(loadSpy).toHaveBeenCalledWith("600 12px Arial");
    });
  });

  test("should return true when an error occured", async () => {
    loadSpy.mockRejectedValue(new Error());
    const { result } = renderHook(() => useWaitForFonts(["12px Arial", "600 12px Arial"]));

    await waitFor(() => {
      expect(result.current).toBe(true);

      expect(loadSpy).toHaveBeenCalledWith("12px Arial");
      expect(loadSpy).toHaveBeenCalledWith("600 12px Arial");
    });
  });
});
